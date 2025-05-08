import { supabase } from '../lib/supabase';
import { analyzeHealthQueryWithSpecialties } from '../lib/openai';
import { DoctorService } from './doctorService';
import { SearchResult } from '../types/search';

export class SearchService {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService(supabase);
  }

  async analyzeHealthQuery(query: string): Promise<SearchResult> {
    const analysis = await analyzeHealthQueryWithSpecialties(query);
    
    // Pobierz lekarzy z odpowiednimi specjalizacjami i procentami dopasowania
    const doctors = await this.doctorService.getDoctorsBySpecialtyNames(
      analysis.specialtyMatches.map(specialty => specialty.name),
      analysis.specialtyMatches.map(specialty => ({
        name: specialty.name,
        matchPercentage: specialty.matchPercentage
      }))
    );

    return {
      query,
      doctors: doctors.map(doctor => ({
        ...doctor,
        relevance_score: doctor.relevance_score || 0,
        best_matching_specialty: analysis.specialtyMatches.find(
          specialty => doctor.specialties.some(s => s.name === specialty.name)
        ) || null
      })),
      analysis: {
        symptoms: analysis.symptoms,
        suggested_specialties: analysis.specialtyMatches.map(match => ({
          name: match.name,
          reasoning: match.reasoning || '',
          matchPercentage: match.matchPercentage
        }))
      }
    };
  }

  async saveSearchHistory(userId: string, query: string, specialties: string[]): Promise<void> {
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query,
        specialties
      });

    if (error) {
      throw new Error(`Błąd podczas zapisywania historii wyszukiwania: ${error.message}`);
    }
  }
}

export const searchService = new SearchService();