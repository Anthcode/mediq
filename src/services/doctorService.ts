import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDoctorCommand, DoctorDTO } from '../types';

export class DoctorService {
  constructor(private supabase: SupabaseClient) {}

  async createDoctor(command: CreateDoctorCommand): Promise<DoctorDTO> {
    const { data, error } = await this.supabase.rpc('create_doctor', {
      doctor_data: command
    });

    if (error) {
      throw new Error(`Failed to create doctor: ${error.message}`);
    }

    // Fetch the created doctor with all relations
    const { data: doctorWithRelations, error: fetchError } = await this.supabase
      .from('doctors')
      .select(`
        *,
        specialties!doctors_specialties (
          id,
          name
        ),
        expertise_areas!doctors_expertise_areas (
          id,
          name
        ),
        addresses (
          id,
          street,
          city,
          state,
          postal_code,
          country
        )
      `)
      .eq('id', data.id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch created doctor: ${fetchError.message}`);
    }

    return doctorWithRelations as DoctorDTO;
  }
}