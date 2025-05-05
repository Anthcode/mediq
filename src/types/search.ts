import type { DoctorDTO } from './dto';

export interface HealthQueryAnalysis {
  symptoms: string[];
  specialtyMatches: {
    id: string;
    name: string;
    matchPercentage: number;
    reasoning?: string;
  }[];
}

export interface SearchAnalysis {
  symptoms: string[];
  suggested_specialties: {
    name: string;
    reasoning: string;
    matchPercentage: number;
  }[];
}

export interface SpecialtyMatch {
  id: string;
  name: string;
  matchPercentage: number;
  description?: string;
  reasoning?: string;
}

export interface SearchResult {
  query: string;
  doctors: Array<DoctorDTO & { 
    relevance_score: number;
    best_matching_specialty: SpecialtyMatch | null;
  }>;
  analysis?: SearchAnalysis;
}