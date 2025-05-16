import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfileDTO, UpdateUserProfileCommand } from '../types/dto';

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

  async getCurrentUserProfile(): Promise<UserProfileDTO> {
    const session = await this.validateSession();
    const user = session.user;

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Błąd pobierania profilu:', error);
        throw new Error(`Nie udało się pobrać profilu: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nie znaleziono profilu użytkownika');
      }

      return data as UserProfileDTO;
    } catch (error) {
      console.error('Błąd w getCurrentUserProfile:', error);
      throw error;
    }
  }

  async updateUserProfile(command: UpdateUserProfileCommand): Promise<UserProfileDTO> {
    const session = await this.validateSession();
    const user = session.user;

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update(command)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Błąd aktualizacji profilu:', error);
        throw new Error(`Nie udało się zaktualizować profilu: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nie znaleziono profilu do aktualizacji');
      }

      return data as UserProfileDTO;
    } catch (error) {
      console.error('Błąd w updateUserProfile:', error);
      throw error;
    }
  }
}