import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDoctorCommand, DoctorDTO, UpdateDoctorCommand } from '../types/dto';

export class DoctorService {
  constructor(private supabase: SupabaseClient) {}

  async getDoctors(): Promise<DoctorDTO[]> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select(`
        *,
        addresses (
          id,
          street,
          city,
          state,
          postal_code,
          country
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('active', true);

    if (error) {
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }

    return data as DoctorDTO[];
  }

  async getDoctorsBySpecialtyName(specialtyNames: string[]): Promise<DoctorDTO[]> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select(`
        *,
        addresses (
          id,
          street,
          city,
          state,
          postal_code,
          country
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('active', true)
      .or(specialtyNames.map(name => `specialties.ilike.%${name}%`).join(','));
    if (error) {
      throw new Error(`Failed to fetch doctors by specialty: ${error.message}`);
    }
    return data as DoctorDTO[];
  }



  async getDoctorById(id: string): Promise<DoctorDTO> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select(`
        *,
        addresses (
          id,
          street,
          city,
          state,
          postal_code,
          country
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }

    return data as DoctorDTO;
  }

  async createDoctor(command: CreateDoctorCommand): Promise<DoctorDTO> {
    const { data, error } = await this.supabase.rpc('create_doctor', {
      doctor_data: command
    });

    if (error) {
      throw new Error(`Failed to create doctor: ${error.message}`);
    }

    return this.getDoctorById(data.id);
  }

  async updateDoctor(id: string, command: UpdateDoctorCommand): Promise<DoctorDTO> {
    const { error } = await this.supabase
      .from('doctors')
      .update(command)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update doctor: ${error.message}`);
    }

    return this.getDoctorById(id);
  }

  async deleteDoctor(id: string): Promise<void> {
    // Soft delete - ustawiamy active na false zamiast usuwać rekord
    const { error } = await this.supabase
      .from('doctors')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete doctor: ${error.message}`);
    }
  }

  async addRating(doctorId: string, rating: number, comment?: string): Promise<void> {
    const { error } = await this.supabase
      .from('ratings')
      .insert({
        doctor_id: doctorId,
        rating,
        comment
      });

    if (error) {
      throw new Error(`Failed to add rating: ${error.message}`);
    }
  }
}