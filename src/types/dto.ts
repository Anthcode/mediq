import {
    Doctor,
    DoctorInsert,
    DoctorUpdate,
    AddressInsert,
    Rating,
    RatingInsert,
    SearchHistory,
    SearchHistoryInsert,
    Specialty,
    ExpertiseArea,
    Address,
} from './database.types';

/* 
  DTO i Command Model dla API:
  
  1. DoctorDTO – reprezentuje szczegóły lekarza wraz z dodatkowymi polami: specialties, expertise_areas i addresses.
  2. CreateDoctorCommand – dane potrzebne do utworzenia lekarza (POST /doctors). Rozszerza DoctorInsert, wykluczając pola generowane automatycznie i dodając relacje.
  3. UpdateDoctorCommand – dane do uaktualnienia lekarza (PUT /doctors/{doctorId}). Wszystkie pola są opcjonalne.
  4. DoctorRatingDTO – reprezentuje ocenę (Rating), zgodne z modelem bazy danych.
  5. CreateRatingCommand – dane do utworzenia nowej oceny dla lekarza (POST /doctors/{doctorId}/ratings).
  6. SearchHistoryDTO – reprezentuje rekord historii wyszukiwania.
  7. CreateSearchHistoryCommand – dane do utworzenia nowego rekordu historii wyszukiwania.
  8. AIAnalysisDTO – wynik analizy zapytań zdrowotnych zwracany przez endpoint /ai/analyze.
  9. UserProfileDTO i UpdateUserProfileCommand – reprezentują profil użytkownika i jego aktualizację.
  10. Auth DTOs – LoginDTO, AuthResponseDTO, RegisterDTO służą do operacji związanych z autentykacją.
*/

/* 1. Doctor DTO and Command Models */

// DTO reprezentujący lekarza z rozszerzonymi relacjami
export interface DoctorDTO extends Doctor {
    specialties: Specialty[];
    expertise_areas: ExpertiseArea[];
    addresses: Address[];
}

// Command model dla tworzenia lekarza
export interface CreateDoctorCommand extends Omit<DoctorInsert, 'id' | 'created_at' | 'updated_at'> {
    // Array identyfikatorów specjalności i obszarów ekspertyz
    specialties: string[];
    expertise_areas: string[];
    // Lista danych adresowych lekarza
    addresses: CreateAddressCommand[];
}

// Command model dla aktualizacji lekarza – wszystkie pola opcjonalne
export interface UpdateDoctorCommand extends Partial<Omit<DoctorUpdate, 'id'>> {
    specialties?: string[];
    expertise_areas?: string[];
    addresses?: Partial<CreateAddressCommand>[];
}

// Command model dla danych adresowych przy tworzeniu lekarza
export type CreateAddressCommand = Omit<AddressInsert, 'id' | 'created_at' | 'updated_at'>;

/* 2. Rating DTO and Command Model */

// Używamy bezpośrednio typu Rating z bazy danych
export type DoctorRatingDTO = Rating;

// Command model dla tworzenia oceny
export type CreateRatingCommand = Omit<RatingInsert, 'id' | 'created_at' | 'updated_at'>;

/* 3. Search History DTO and Command Model */

// DTO reprezentujący historię wyszukiwania
export type SearchHistoryDTO = SearchHistory;

// Command model dla tworzenia rekordu historii wyszukiwania
export type CreateSearchHistoryCommand = Omit<SearchHistoryInsert, 'id' | 'created_at'>;

/* 4. AI Analysis DTO */

// DTO zawierające wynik analizy zapytań zdrowotnych z użyciem OpenAI API
export interface AIAnalysisDTO {
    identified_symptoms: string[];
    suggested_specialties: string[];
    // Lista lekarzy wraz z procentowym dopasowaniem
    doctors_match: {
        doctor_id: string;
        match_percentage: number;
    }[];
    analysis_id: string;
}

/* 5. User Profile DTO and Command Model */

// DTO reprezentujący profil użytkownika, rozszerzenie danych z systemu autentykacji
export interface UserProfileDTO {
    first_name: string;
    last_name: string;
    role: string;
}

// Command model dla aktualizacji profilu użytkownika – pola opcjonalne
export type UpdateUserProfileCommand = Partial<UserProfileDTO>;

/* 6. Authentication DTOs */

// DTO dla logowania użytkownika
export interface LoginDTO {
    email: string;
    password: string;
}

// DTO reprezentujący odpowiedź autoryzacyjną
export interface AuthResponseDTO {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

// DTO dla rejestracji nowego użytkownika
export interface RegisterDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}