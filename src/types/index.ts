import type { 
  Doctor as BaseDoctor, 
  Specialty, 
  ExpertiseArea, 
  Address, 
  Rating 
} from './database.types';

// Rozszerzony interfejs Doctor dla UI
export interface Doctor extends BaseDoctor {
  specialties?: Specialty[];
  expertise_areas?: ExpertiseArea[];
  address?: Address;
  ratings?: Rating[];
  average_rating?: number;
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

// Enums dla UI
export enum WeekDay {
  PONIEDZIALEK = 'Poniedziałek',
  WTOREK = 'Wtorek',
  SRODA = 'Środa',
  CZWARTEK = 'Czwartek',
  PIATEK = 'Piątek',
  SOBOTA = 'Sobota',
  NIEDZIELA = 'Niedziela'
}

// Re-eksportujemy typy z bazy danych, które są używane bezpośrednio
export type { Address, Rating, Specialty };