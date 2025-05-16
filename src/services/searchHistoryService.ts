import { SupabaseClient } from '@supabase/supabase-js';
import { SearchHistoryDTO, CreateSearchHistoryCommand } from '../types/dto';

export class SearchHistoryService {
  constructor(private supabase: SupabaseClient) {}

  async getUserSearchHistory(userId: string): Promise<SearchHistoryDTO[]> {
    const { data, error } = await this.supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Nie udało się pobrać historii wyszukiwań: ${error.message}`);
    }

    return data as SearchHistoryDTO[];
  }

  async saveSearchHistory(command: CreateSearchHistoryCommand): Promise<SearchHistoryDTO> {
    const { data, error } = await this.supabase
      .from('search_history')
      .insert(command)
      .select()
      .single();

    if (error) {
      throw new Error(`Nie udało się zapisać historii wyszukiwania: ${error.message}`);
    }

    return data as SearchHistoryDTO;
  }

  async deleteSearchHistoryItem(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('search_history')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Nie udało się usunąć wpisu z historii: ${error.message}`);
    }
  }

  async clearUserSearchHistory(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Nie udało się wyczyścić historii wyszukiwań: ${error.message}`);
    }
  }
}
