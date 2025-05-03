import type { DoctorDTO } from './dto';

export interface SearchAnalysis {
  symptoms: string[];
  suggested_specialties: string[];
}

export interface SearchResult {
  query: string;
  doctors: Array<DoctorDTO & { relevance_score: number }>;
  analysis?: SearchAnalysis;
}