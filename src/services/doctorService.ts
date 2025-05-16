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
    // Rozpocznij transakcję
    const { addresses, ...doctorData } = command;
    
    // Aktualizuj podstawowe dane lekarza
    const { error: doctorError } = await this.supabase
      .from('doctors')
      .update(doctorData)
      .eq('id', id);

    if (doctorError) {
      throw new Error(`Failed to update doctor: ${doctorError.message}`);
    }

    // Jeśli są nowe adresy do zaktualizowania
    if (addresses && addresses.length > 0) {
      // Usuń stare adresy
      const { error: deleteError } = await this.supabase
        .from('addresses')
        .delete()
        .eq('doctor_id', id);

      if (deleteError) {
        throw new Error(`Failed to update addresses: ${deleteError.message}`);
      }      // Dodaj nowe adresy z użyciem funkcji RPC
      const { error: addressError } = await this.supabase.rpc('manage_doctor_addresses', {
        p_doctor_id: id,
        p_addresses: addresses.map(address => ({
          ...address,
          doctor_id: id
        }))
      });

      if (addressError) {
        throw new Error(`Failed to insert new addresses: ${addressError.message}`);
      }
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