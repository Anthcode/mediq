import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfileDTO, UpdateUserProfileCommand } from '../types/dto';

/**
 * UserService - zarządzanie profilem użytkownika
 * 
 * UWAGA: Ze względu na problemy z rekursją w politykach RLS dla tabeli "profiles",
 * zdecydowano o użyciu danych bezpośrednio z obiektu auth.users i jego metadanych
 * zamiast wykonywania zapytań do tabeli profiles. Takie rozwiązanie pozwala
 * ominąć problem nieskończonej rekursji w politykach bezpieczeństwa.
 */
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
      // Zamiast pobierać dane z tabeli profiles, używamy metadanych użytkownika z sesji
      // To pozwala ominąć problem rekursji w politykach RLS
      return {
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        role: user.user_metadata?.role || 'user'
      };
    } catch (error) {
      console.error('Błąd w getCurrentUserProfile:', error);
      throw error;
    }
  }
  async updateUserProfile(command: UpdateUserProfileCommand): Promise<UserProfileDTO> {
    const session = await this.validateSession();
    const user = session.user;

    try {
      // Aktualizacja metadanych użytkownika zamiast tabeli profiles
      // To pozwala ominąć problem rekursji w politykach RLS
      const { data, error } = await this.supabase.auth.updateUser({
        data: {
          first_name: command.first_name !== undefined ? command.first_name : user.user_metadata?.first_name,
          last_name: command.last_name !== undefined ? command.last_name : user.user_metadata?.last_name,
          // Nie pozwalamy na zmianę roli poprzez tę metodę (powinna być zarządzana administracyjnie)
          role: user.user_metadata?.role || 'user'
        }
      });

      if (error) {
        console.error('Błąd aktualizacji danych użytkownika:', error);
        throw new Error(`Nie udało się zaktualizować profilu: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('Nie znaleziono użytkownika do aktualizacji');
      }

      // Zwracamy zaktualizowane dane w formacie UserProfileDTO
      return {
        first_name: data.user.user_metadata?.first_name || '',
        last_name: data.user.user_metadata?.last_name || '',
        role: data.user.user_metadata?.role || 'user'
      };
    } catch (error) {
      console.error('Błąd w updateUserProfile:', error);
      throw error;
    }
  }
}