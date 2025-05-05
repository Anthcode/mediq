import { analyzeHealthQueryWithSpecialties } from '../../lib/openai';
import { HealthQueryAnalysis } from '../../types/search';

describe('Integracja analizy zapytań zdrowotnych', () => {
  it('powinien zwracać poprawną strukturę odpowiedzi', async () => {
    const result = await analyzeHealthQueryWithSpecialties('Mam silne bóle głowy, zawroty i nudności od tygodnia');
    
    // Sprawdzenie podstawowej struktury
    expect(result).toBeDefined();
    expect(result).toHaveProperty('symptoms');
    expect(result).toHaveProperty('specialtyMatches');
    expect(Array.isArray(result.symptoms)).toBe(true);
    expect(Array.isArray(result.specialtyMatches)).toBe(true);
    
    // Sprawdzenie poprawności danych symptomów
    expect(result.symptoms.length).toBeGreaterThan(0);
    result.symptoms.forEach(symptom => {
      expect(typeof symptom).toBe('string');
      expect(symptom.length).toBeGreaterThan(0);
    });
    
    // Sprawdzenie poprawności dopasowanych specjalizacji
    expect(result.specialtyMatches.length).toBeGreaterThan(0);
    expect(result.specialtyMatches.length).toBeLessThanOrEqual(3);
    
    result.specialtyMatches.forEach(match => {
      expect(match).toHaveProperty('id');
      expect(match).toHaveProperty('name');
      expect(match).toHaveProperty('matchPercentage');
      expect(typeof match.id).toBe('string');
      expect(typeof match.name).toBe('string');
      expect(typeof match.matchPercentage).toBe('number');
      expect(match.matchPercentage).toBeGreaterThanOrEqual(0);
      expect(match.matchPercentage).toBeLessThanOrEqual(100);
      
      if (match.reasoning) {
        expect(typeof match.reasoning).toBe('string');
      }
    });
  });

  it('powinien sortować specjalizacje według procentu dopasowania', async () => {
    const result = await analyzeHealthQueryWithSpecialties('Mam silne bóle głowy, zawroty i nudności od tygodnia');
    
    // Sprawdzenie sortowania
    for (let i = 1; i < result.specialtyMatches.length; i++) {
      expect(result.specialtyMatches[i-1].matchPercentage)
        .toBeGreaterThanOrEqual(result.specialtyMatches[i].matchPercentage);
    }
  });

  it('powinien obsługiwać błędy API', async () => {
    // Symulacja błędu API poprzez pusty string jako zapytanie
    await expect(analyzeHealthQueryWithSpecialties('')).rejects.toThrow();
  });
});