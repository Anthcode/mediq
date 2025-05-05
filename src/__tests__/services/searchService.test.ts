import { SearchService } from '../../services/searchService';
import { analyzeHealthQueryWithSpecialties } from '../../lib/openai';
import { DoctorService } from '../../services/doctorService';
import { supabase } from '../../lib/supabase';

// Mock dla zależności
jest.mock('../../lib/openai');
jest.mock('../../services/doctorService');
jest.mock('../../lib/supabase');

describe('SearchService', () => {
  let searchService: SearchService;
  
  beforeEach(() => {
    searchService = new SearchService();
  });
  
  it('powinien analizować zapytanie i zwracać lekarzy według dopasowanych specjalizacji', async () => {
    // Przygotowanie mockowanych danych
    const mockAnalysis = {
      symptoms: ['ból głowy', 'zawroty głowy'],
      specialtyMatches: [
        { id: 'spec1', name: 'Neurolog', matchPercentage: 90 },
        { id: 'spec2', name: 'Okulista', matchPercentage: 70 },
        { id: 'spec3', name: 'Internista', matchPercentage: 50 }
      ]
    };
    
    const mockDoctors = [
      {
        id: 'doc1',
        first_name: 'Jan',
        last_name: 'Kowalski',
        specialties: [{ id: 'spec1', name: 'Neurolog' }],
        expertise_areas: [],
        addresses: [],
        ratings: []
      },
      {
        id: 'doc2',
        first_name: 'Anna',
        last_name: 'Nowak',
        specialties: [{ id: 'spec2', name: 'Okulista' }],
        expertise_areas: [],
        addresses: [],
        ratings: []
      }
    ];
    
    // Mockowanie funkcji
    (analyzeHealthQueryWithSpecialties as jest.Mock).mockResolvedValue(mockAnalysis);
    (DoctorService.prototype.getDoctorsBySpecialties as jest.Mock).mockResolvedValue(mockDoctors);
    
    // Wykonanie testu
    const result = await searchService.searchDoctorsBySymptoms('mam ból głowy i zawroty');
    
    // Asercje
    expect(result.query).toBe('mam ból głowy i zawroty');
    expect(result.doctors).toHaveLength(2);
    expect(result.doctors[0].relevance_score).toBe(90); // Neurolog powinien mieć najwyższy wynik
    expect(result.doctors[1].relevance_score).toBe(70); // Okulista powinien być drugi
    expect(result.analysis?.symptoms).toEqual(['ból głowy', 'zawroty głowy']);
    expect(result.analysis?.suggested_specialties).toEqual(['Neurolog', 'Okulista', 'Internista']);
  });

  it('powinien zapisywać historię wyszukiwania', async () => {
    const userId = 'test-user-id';
    const query = 'test query';
    const specialties = ['Neurolog', 'Okulista'];

    await searchService.saveSearchHistory(userId, query, specialties);

    expect(supabase.from).toHaveBeenCalledWith('search_history');
    expect(supabase.from('search_history').insert).toHaveBeenCalledWith({
      user_id: userId,
      query,
      specialties
    });
  });
});