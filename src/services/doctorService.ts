import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDoctorCommand, DoctorDTO, UpdateDoctorCommand } from '../types/dto';

export class DoctorService {
  constructor(private supabase: SupabaseClient) {}

  async getDoctors(): Promise<DoctorDTO[]> {
    const { data, error } = await this.supabase
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

  async getDoctorById(id: string): Promise<DoctorDTO> {
    const { data, error } = await this.supabase
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

  async getDoctorsBySpecialties(specialtyIds: string[]): Promise<DoctorDTO[]> {
    if (!specialtyIds.length) {
      return [];
    }

    const { data, error } = await this.supabase
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
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('active', true)
      .in('specialties.id', specialtyIds);

    if (error) {
      throw new Error(`Błąd podczas pobierania lekarzy według specjalizacji: ${error.message}`);
    }

    return data as DoctorDTO[];
  }

  async getDoctorsBySpecialtyNames(
    specialtyNames: string[],
    specialtyMatches?: { name: string; matchPercentage: number }[]
  ): Promise<DoctorDTO[]> {
    if (!specialtyNames.length) {
      return [];
    }

    // Pobierz specjalizacje z bazy danych
    const { data: specialties, error: specialtiesError } = await this.supabase
      .from('specialties')
      .select('id, name')
      .in('name', specialtyNames);
      
    if (specialtiesError) {
      throw new Error(`Błąd podczas pobierania specjalizacji: ${specialtiesError.message}`);
    }

    if (!specialties || specialties.length === 0) {
      return [];
    }

    // Pobierz lekarzy z odpowiednimi specjalizacjami
    const { data: doctors, error: doctorsError } = await this.supabase
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
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('active', true)
      .in('specialties.name', specialtyNames);

    if (doctorsError) {
      throw new Error(`Błąd podczas pobierania lekarzy: ${doctorsError.message}`);
    }

    if (!doctors) {
      return [];
    }

    // Jeśli mamy dane o dopasowaniu z OpenAI, przypisz procent dopasowania
    if (specialtyMatches) {
      return doctors.map((doctor) => {
        // Znajdź najwyższy procent dopasowania spośród specjalizacji lekarza
        const bestMatch = Math.max(
          ...doctor.specialties
            .map((specialty: { name: string }) => {
              const match = specialtyMatches.find((sm) => sm.name === specialty.name);
              return match ? match.matchPercentage : 0;
            })
            .filter((percentage: number) => percentage > 0)
        );

        return {
          ...doctor,
          matchPercentage: bestMatch || 0,
          relevance_score: bestMatch || 0 // dla kompatybilności wstecznej
        };
      }).filter(doctor => doctor.matchPercentage > 0); // Zwróć tylko lekarzy z dopasowaniem większym niż 0
    }

    // Jeśli nie ma danych o dopasowaniu, zwróć wszystkich znalezionych lekarzy z zerowym dopasowaniem
    return doctors.map(doctor => ({
      ...doctor,
      matchPercentage: 0,
      relevance_score: 0
    }));
  }
}