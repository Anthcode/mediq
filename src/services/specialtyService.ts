import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Specialty = Database['public']['Tables']['specialties']['Row'];

interface SpecialtyFilter {
  name?: string;
  nameContains?: string;
  nameStartsWith?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  ids?: string[];
  excludeIds?: string[];
}

export class SpecialtyService {
  constructor() {}

  async getAllSpecialties(): Promise<Specialty[]> {
    const { data, error } = await supabase
      .from('specialties')
      .select('id, name, created_at, updated_at')
      .order('name');
      
    if (error) {
      throw new Error(`Błąd podczas pobierania specjalizacji: ${error.message}`);
    }
    console.log('Specialties:', data);
    return data || [];
  }

  async getSpecialtiesByIds(ids: string[]): Promise<Specialty[]> {
    if (!ids.length) {
      return [];
    }

    const { data, error } = await supabase
      .from('specialties')
      .select('id, name, created_at, updated_at')
      .in('id', ids);

    if (error) {
      throw new Error(`Błąd podczas pobierania specjalizacji według ID: ${error.message}`);
    }

    return data || [];
  }

  async getFilteredSpecialties(filter: SpecialtyFilter): Promise<Specialty[]> {
    let query = supabase
      .from('specialties')
      .select('id, name, created_at, updated_at');

    // Exact match
    if (filter.name) {
      query = query.eq('name', filter.name);
    }

    // Case-insensitive partial match
    if (filter.nameContains) {
      query = query.ilike('name', `%${filter.nameContains}%`);
    }

    // Case-sensitive starts with
    if (filter.nameStartsWith) {
      query = query.like('name', `${filter.nameStartsWith}%`);
    }

    // Date range
    if (filter.createdAfter) {
      query = query.gte('created_at', filter.createdAfter.toISOString());
    }
    if (filter.createdBefore) {
      query = query.lte('created_at', filter.createdBefore.toISOString());
    }

    // Include specific IDs
    if (filter.ids?.length) {
      query = query.in('id', filter.ids);
    }

    // Exclude specific IDs
    if (filter.excludeIds?.length) {
      query = query.not('id', 'in', filter.excludeIds);
    }

    // Order results
    query = query.order('name');

    const { data, error } = await query;

    if (error) {
      throw new Error(`Błąd podczas filtrowania specjalizacji: ${error.message}`);
    }

    return data || [];
  }
}