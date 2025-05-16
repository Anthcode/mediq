import {
    DoctorInsert,
    AddressInsert,
    Rating,
    RatingInsert,
    SearchHistory,
    SearchHistoryInsert,
    Address,
} from './database.types';

/* 
  DTO i Command Model dla API:
  1. DoctorDTO – uproszczony model bez relacji do specialties/expertise_areas.
  2. CreateDoctorCommand – specialties jako string, bez tablicy ID.
  3. UpdateDoctorCommand – jak wyżej.
*/

/* 1. Doctor DTO and Command Models */

// DTO reprezentujący lekarza z rozszerzonymi relacjami
export interface DoctorDTO {
    id: string;
    first_name: string;
    last_name: string;
    active: boolean;
    experience: number | null;
    education: string | null;
    bio: string | null;
    profile_image_url: string | null;
    specialties: string; // tekstowy opis specjalizacji
    addresses: Address[];
    ratings: Rating[];
    relevance_score?: number;
    best_matching_specialty?: {
        name: string;
        matchPercentage: number;
        description?: string;
        reasoning?: string;
    } | null;
}

// Command model dla tworzenia lekarza
export interface CreateDoctorCommand extends Omit<DoctorInsert, 'id' | 'created_at' | 'updated_at'> {
    specialties: string; // tekstowy opis specjalizacji
    addresses: CreateAddressCommand[];
}

// Command model dla aktualizacji lekarza – wszystkie pola opcjonalne
export type UpdateDoctorCommand = Partial<CreateDoctorCommand>;

// Command model dla danych adresowych przy tworzeniu lekarza
export interface CreateAddressCommand extends Omit<AddressInsert, 'id'> {
    is_primary?: boolean;
}

/* 2. Rating DTO and Command Model */

// Używamy bezpośrednio typu Rating z bazy danych
export type DoctorRatingDTO = Rating;

// Command model dla tworzenia oceny
export type CreateRatingCommand = Omit<RatingInsert, 'id' | 'created_at' | 'updated_at'>;

/* 3. Search History DTO and Command Model */

// DTO reprezentujący historię wyszukiwania
export type SearchHistoryDTO = SearchHistory;

// Command model dla tworzenia rekordu historii wyszukiwania - wersja podstawowa
export type CreateSearchHistoryCommandBase = Omit<SearchHistoryInsert, 'id' | 'created_at'>;

/* 4. AI Analysis DTO */

// DTO zawierające wynik analizy zapytań zdrowotnych z użyciem OpenAI API
export interface AIAnalysisDTO {
    query: string;
    symptoms: string[];
    suggested_specialties: Array<{
        name: string;
        matchPercentage: number;
        reasoning: string;
    }>;
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

/* 7. Search History Command Models */

// Rozszerzona wersja command modelu dla historii wyszukiwania
export interface CreateSearchHistoryCommand {
    user_id: string;
    query: string;
    specialties: string[];
}