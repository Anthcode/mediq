import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfileDTO, UpdateUserProfileCommand } from '../types/dto';

export class UserService {
  constructor(private supabase: SupabaseClient) {}

  async getCurrentUserProfile(): Promise<UserProfileDTO> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error(`Nie udało się pobrać profilu: ${error.message}`);
    }

    return data as UserProfileDTO;
  }

  async updateUserProfile(command: UpdateUserProfileCommand): Promise<UserProfileDTO> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .update(command)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Nie udało się zaktualizować profilu: ${error.message}`);
    }

    return data as UserProfileDTO;
  }
}