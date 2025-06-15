import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfileDTO, UpdateUserProfileCommand } from '../types/dto';
import { UserRole } from '../types/auth';

export class UserService {
  constructor(private supabase: SupabaseClient) {}

  private async validateSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    
    if (error) {
      console.error('Błąd walidacji sesji:', error);
      throw new Error('Nie można zweryfikować sesji użytkownika');
    }

    if (!session) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    return session;
  }
  
  /**
   * Tworzy domyślny profil użytkownika i rolę, jeśli nie istnieją
   * Używana w przypadku gdy wykryto brak profilu w bazie danych
   */
  private async createDefaultProfile(
    userId: string, 
    email: string, 
    firstName: string, 
    lastName: string
  ): Promise<void> {
    try {
      console.log('Tworzenie domyślnego profilu dla:', userId);
      
      // 1. Sprawdź czy profil już istnieje
      const { data: existingProfile } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (!existingProfile) {
        // 2. Utwórz profil, jeśli nie istnieje
        const { error: profileError } = await this.supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            first_name: firstName || 'Nowy',
            last_name: lastName || 'Użytkownik'
          });
          
        if (profileError) {
          console.error('Błąd tworzenia profilu:', profileError);
          throw new Error(`Nie udało się utworzyć profilu: ${profileError.message}`);
        }
      }
      
      // 3. Sprawdź czy rola już istnieje
      const { data: existingRole } = await this.supabase
        .from('user_roles')
        .select('user_id')
        .eq('user_id', userId)
        .single();
        
      if (!existingRole) {
        // 4. Utwórz rolę, jeśli nie istnieje
        const { error: roleError } = await this.supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'user'
          });
          
        if (roleError) {
          console.error('Błąd tworzenia roli:', roleError);
          throw new Error(`Nie udało się utworzyć roli: ${roleError.message}`);
        }
      }
      
      console.log('Pomyślnie utworzono domyślny profil i rolę dla:', userId);
    } catch (error) {
      console.error('Błąd w createDefaultProfile:', error);
      throw error;
    }
  }
  async getCurrentUserProfile(): Promise<UserProfileDTO> {
  
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      //console.log('Pobieranie profilu dla użytkownika:', user.id);
      
      // Pobieramy podstawowe dane profilu z tabeli profiles
      let profileResult = await this.supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileResult.error) {
        console.error('Błąd pobierania profilu:', profileResult.error);
        
        // Sprawdź czy błąd dotyczy braku danych
        if (profileResult.error.code === 'PGRST116') {
          // Spróbuj utworzyć profil dla użytkownika
          console.log('Profil nie istnieje, próba utworzenia...');
          try {
            await this.createDefaultProfile(
              user.id, 
              user.email || '', 
              user.user_metadata?.first_name || '', 
              user.user_metadata?.last_name || ''
            );
            
            // Spróbuj ponownie pobrać dane po utworzeniu profilu
            profileResult = await this.supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', user.id)
              .single();
              
            if (profileResult.error) {
              console.error('Nadal błąd po próbie utworzenia profilu:', profileResult.error);
              throw new Error(`Nie udało się utworzyć ani pobrać profilu: ${profileResult.error.message}`);
            }
          } catch (createError) {
            console.error('Błąd podczas tworzenia domyślnego profilu:', createError);
            throw new Error('Nie udało się utworzyć profilu użytkownika. Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.');
          }
        } else {
          throw new Error(`Nie udało się pobrać profilu: ${profileResult.error.message}`);
        }
      }

      if (!profileResult.data) {
        throw new Error('Nie znaleziono profilu użytkownika');
      }

      // Pobieramy rolę użytkownika z tabeli user_roles
      const roleResult = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleResult.error) {
        console.error('Błąd pobierania roli:', roleResult.error);
        
        // Jeśli nie ma rekordu roli, tworzymy go
        if (roleResult.error.code === 'PGRST116') {
          console.log('Brak roli, tworzenie domyślnej roli użytkownika');
          const insertResult = await this.supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'user'
            });
              if (insertResult.error) {
            console.error('Błąd tworzenia roli użytkownika:', insertResult.error);
            throw new Error(`Nie udało się utworzyć roli użytkownika: ${insertResult.error.message}`);
          } else {
            console.log('Utworzono domyślną rolę użytkownika');
            // Zwracamy domyślną rolę zamiast tworzyć obiekt roleResult
            return {
              ...profileResult.data,
              role: 'user'
            } as UserProfileDTO;
          }
        } else {
          throw new Error(`Nie udało się pobrać roli użytkownika: ${roleResult.error.message}`);
        }
      }
      
         
      // Łączymy dane profilu z rolą z tabeli user_roles
      return {
        ...profileResult.data,
        role: roleResult.data?.role || 'user'
      } as UserProfileDTO;
    } catch (error) {
      console.error('Błąd w getCurrentUserProfile:', error);
      throw error;
    }
  }
   
  async updateUserProfile(command: UpdateUserProfileCommand): Promise<UserProfileDTO> {
    const session = await this.validateSession();
    const user = session.user;

    try {
      // Aktualizujemy tylko dane profilu, bez roli
      const { data, error } = await this.supabase
        .from('profiles')
        .update({
          first_name: command.first_name,
          last_name: command.last_name
        })
        .eq('id', user.id)
        .select('first_name, last_name')
        .single();

      if (error) {
        console.error('Błąd aktualizacji profilu:', error);
        throw new Error(`Nie udało się zaktualizować profilu: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nie znaleziono profilu do aktualizacji');
      }

      // Pobieramy rolę z tabeli user_roles, aby zwrócić kompletny obiekt UserProfileDTO
      const { data: roleData } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      return {
        ...data,
        role: roleData?.role || 'user'
      } as UserProfileDTO;
    } catch (error) {
      console.error('Błąd w updateUserProfile:', error);
      throw error;
    }
  }
  /**
   * Sprawdza i naprawia profil użytkownika
   * Użyj tej funkcji, aby upewnić się, że profil i rola użytkownika istnieją
   */
  async ensureUserProfileExists(userId?: string): Promise<void> {
    try {
      // 1. Najpierw sprawdź, czy mamy aktualną sesję użytkownika
      let userToCheck: string;
      
      if (userId) {
        userToCheck = userId;
      } else {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) {
          console.log('Brak zalogowanego użytkownika do sprawdzenia');
          return;
        }
        userToCheck = user.id;
      }
      
      //console.log('Sprawdzanie profilu użytkownika:', userToCheck);
      
      // 2. Sprawdź czy profil istnieje
      const { data: profileData, error: profileError } = await this.supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', userToCheck)
        .single();
        
      // 3. Jeśli nie znaleziono profilu lub wystąpił błąd, utwórz go
      if (!profileData || profileError) {
        console.log('Brak profilu lub błąd, pobieranie danych użytkownika...', profileError);
        
        // Pobierz dane użytkownika z Supabase Auth
        const { data } = await this.supabase.auth.admin.getUserById(userToCheck);
        
        if (!data?.user) {
          console.error('Błąd pobierania danych użytkownika');
          throw new Error('Nie udało się pobrać danych użytkownika do naprawy profilu');
        }
        
        // Utwórz nowy profil
       // console.log('Tworzenie nowego profilu dla użytkownika:', data.user.id);
        await this.createDefaultProfile(
          data.user.id,
          data.user.email || '',
          data.user.user_metadata?.first_name || '',
          data.user.user_metadata?.last_name || ''
        );
        console.log('Nowy profil został utworzony pomyślnie');
      } else {
       // console.log('Profil użytkownika istnieje:', profileData);
      }
      
      // 4. Sprawdź czy rola istnieje
      const { data: roleData, error: roleError } = await this.supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('user_id', userToCheck)
        .single();
        
      // 5. Jeśli nie znaleziono roli lub wystąpił błąd, utwórz ją
      if (!roleData || roleError) {
        console.log('Brak roli lub błąd, tworzenie domyślnej roli użytkownika:', roleError);
        
        const { error: createRoleError } = await this.supabase
          .from('user_roles')
          .insert({
            user_id: userToCheck,
            role: 'user'
          });
          
        if (createRoleError) {
          console.error('Błąd tworzenia roli:', createRoleError);
          throw new Error(`Nie udało się utworzyć roli użytkownika: ${createRoleError.message}`);
        } else {
          console.log('Utworzono domyślną rolę dla użytkownika');
        }
      } else {
        //console.log('Rola użytkownika istnieje:', roleData);
      }
      
    } catch (error) {
      console.error('Błąd w ensureUserProfileExists:', error);
      throw error; // Re-throw aby obsłużyć błąd w komponencie
    }
  }

  /**
   * Pobiera rolę użytkownika
   */
  async getUserRole(userId: string): Promise<UserRole> {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Błąd pobierania roli:', error);
        return 'user'; // Domyślna rola
      }

      return data?.role as UserRole || 'user';
    } catch (error) {
      console.error('Błąd w getUserRole:', error);
      return 'user';
    }
  }

  /**
   * Aktualizuje rolę użytkownika (tylko dla administratorów)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    await this.validateSession();

    try {
      const { error } = await this.supabase
        .from('user_roles')
        .update({ role, updated_at: new Date() })
        .eq('user_id', userId);

      if (error) {
        console.error('Błąd aktualizacji roli:', error);
        throw new Error(`Nie udało się zaktualizować roli: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Błąd w updateUserRole:', error);
      throw error;
    }
  }
}
