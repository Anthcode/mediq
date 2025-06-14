import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDoctorCommand, DoctorDTO, UpdateDoctorCommand } from '../types/dto';

export class DoctorService {
  constructor(private supabase: SupabaseClient) {}

  async getDoctors(): Promise<DoctorDTO[]> {
    // FIXME: W przyszłości dodać integrację z tabelą expertise_areas
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
    // FIXME: W przyszłości dodać integrację z tabelą expertise_areas
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
  }  async createDoctor(command: CreateDoctorCommand): Promise<DoctorDTO> {
    // Wydzielamy adresy z command
    const { addresses, ...doctorData } = command;
    
    // Przygotowujemy dane dla funkcji 1 (oczekuje address, nie addresses)
    const cleanCommand: Record<string, unknown> = { ...doctorData };
    
    // Funkcja 1 obsługuje tylko jeden adres jako 'address' (nie 'addresses')
    if (addresses && addresses.length > 0) {      // Bierzemy pierwszy adres i usuwamy pole doctor_id (będzie ustawione przez funkcję DB)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { doctor_id: _doctor_id, is_primary: _is_primary, ...addressData } = addresses[0];
      cleanCommand.address = addressData;
    }
    
    // Wywołujemy RPC z oczyszczonymi danymi
    const { data, error } = await this.supabase.rpc('create_doctor', {
      doctor_data: cleanCommand
    });

    if (error) {
      console.error("Error details:", error);
      throw new Error(`Failed to create doctor: ${error.message}`);
    }

    return this.getDoctorById(data);
  }
  async updateDoctor(id: string, command: UpdateDoctorCommand): Promise<DoctorDTO> {
    // Wydzielamy adresy z command
    const { addresses, ...doctorData } = command;
    
    // Aktualizuj podstawowe dane lekarza bezpośrednio
    const { error: doctorError } = await this.supabase
      .from('doctors')
      .update(doctorData)
      .eq('id', id);

    if (doctorError) {
      throw new Error(`Failed to update doctor: ${doctorError.message}`);
    }

    // Jeśli są adresy do zaktualizowania
    if (addresses && addresses.length > 0) {      // Przygotuj adresy bez problematycznych pól UUID
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanAddresses = addresses.map(({ doctor_id: _doctor_id, is_primary: _is_primary, ...addressData }) => addressData);
      
      // Użyj funkcji RPC do zarządzania adresami
      const { error: addressError } = await this.supabase.rpc('manage_doctor_addresses', {
        p_doctor_id: id,
        p_addresses: cleanAddresses
      });

      if (addressError) {
        throw new Error(`Failed to update addresses: ${addressError.message}`);
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