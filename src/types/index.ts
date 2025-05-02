export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  address: string;
  profile_image: string;
  expertise_areas: string[];
  education: string;
  bio: string;
  schedule: DaySchedule[];
  relevance_score?: number;
}

export interface DaySchedule {
  day: string;
  hours: string;
}

export interface SearchResult {
  doctors: Doctor[];
  query: string;
  analysis?: {
    symptoms: string[];
    suggested_specialties: string[];
  };
}

export interface HealthQueryAnalysis {
  symptoms: string[];
  suggested_specialties: string[];
  relevance_scores: Record<string, number>;
}

export interface AuthError {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

// Enums dla stałych wartości
export enum Specialty {
  KARDIOLOG = 'Kardiolog',
  NEUROLOG = 'Neurolog',
  DERMATOLOG = 'Dermatolog',
  PEDIATRA = 'Pediatra',
  INTERNISTA = 'Internista',
  ORTOPEDA = 'Ortopeda',
  OKULISTA = 'Okulista',
  LARYNGOLOG = 'Laryngolog',
  GINEKOLOG = 'Ginekolog',
  UROLOG = 'Urolog',
  PSYCHIATRA = 'Psychiatra',
  ENDOKRYNOLOG = 'Endokrynolog'
}

export enum WeekDay {
  PONIEDZIALEK = 'Poniedziałek',
  WTOREK = 'Wtorek',
  SRODA = 'Środa',
  CZWARTEK = 'Czwartek',
  PIATEK = 'Piątek',
  SOBOTA = 'Sobota',
  NIEDZIELA = 'Niedziela'
}