# Plan wdrożenia funkcjonalności dopasowania specjalizacji lekarskich do objawów

## Etap 1: Przygotowanie integracji z LLM i struktury danych

### 1.1. Modyfikacja modelu danych

Przed rozpoczęciem implementacji należy zmodyfikować istniejące modele typów w TypeScript, aby uwzględnić nową funkcjonalność dopasowania specjalizacji:

```typescript
// src/types/search.ts

export interface SpecialtyMatch {
  id: string;
  name: string;
  matchPercentage: number;
  description?: string;
}

export interface HealthQueryAnalysis {
  symptoms: string[];
  specialtyMatches: SpecialtyMatch[];
}
```

### 1.2. Pobieranie listy specjalizacji z Supabase

Utworzenie serwisu do pobierania unikalnych specjalizacji z bazy danych:

```typescript
// src/services/specialtyService.ts

import { supabase } from '../lib/supabase';
import { Specialty } from '../types/database.types';

export class SpecialtyService {
  async getAllSpecialties(): Promise<Specialty[]> {
    const { data, error } = await supabase
      .from('specialties')
      .select('id, name')
      .order('name');
      
    if (error) {
      throw new Error(`Błąd podczas pobierania specjalizacji: ${error.message}`);
    }
    
    return data || [];
  }
}
```

### 1.3. Przygotowanie schematu JSON dla response_format

Implementacja schematu JSON, który będzie używany w żądaniach do OpenAI:

```typescript
// src/lib/specialtyMatchSchema.ts

export const specialtyMatchSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'specialtyMatches',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        symptoms: {
          type: 'array',
          items: { 
            type: 'string' 
          },
          description: 'Lista zidentyfikowanych objawów wymienionych przez użytkownika'
        },
        specialtyMatches: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { 
                type: 'string',
                description: 'ID specjalizacji z bazy danych' 
              },
              name: { 
                type: 'string',
                description: 'Nazwa specjalizacji lekarskiej' 
              },
              matchPercentage: { 
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Procentowe dopasowanie specjalizacji do objawów (0-100)' 
              },
              reasoning: { 
                type: 'string',
                description: 'Krótkie uzasadnienie, dlaczego ta specjalizacja jest odpowiednia' 
              }
            },
            required: ['id', 'name', 'matchPercentage']
          },
          description: 'Lista specjalizacji lekarskich dopasowanych do objawów'
        }
      },
      required: ['symptoms', 'specialtyMatches']
    }
  }
};
```

## Etap 2: Implementacja logiki dopasowania specjalizacji

### 2.1. Modyfikacja funkcji analizy zapytań zdrowotnych

Rozbudowa istniejącej funkcji w `src/lib/openai.ts` do obsługi dopasowania specjalizacji:

```typescript
// src/lib/openai.ts

import { openai } from './openai';
import { SpecialtyService } from '../services/specialtyService';
import { specialtyMatchSchema } from './specialtyMatchSchema';
import { HealthQueryAnalysis, SpecialtyMatch } from '../types/search';

export async function analyzeHealthQueryWithSpecialties(query: string): Promise<HealthQueryAnalysis> {
  // Pobierz wszystkie specjalizacje z bazy danych
  const specialtyService = new SpecialtyService();
  const allSpecialties = await specialtyService.getAllSpecialties();
  
  // Przygotuj kontekst dla modelu LLM
  const specialtiesContext = allSpecialties.map(s => ({
    id: s.id,
    name: s.name
  }));
  
  const prompt = `
  Przeanalizuj następujący opis objawów pacjenta i dopasuj najlepsze specjalizacje lekarskie.
  
  Objawy:
  "${query}"
  
  Dostępne specjalizacje:
  ${JSON.stringify(specialtiesContext)}
  
  Zwróć listę zidentyfikowanych objawów oraz 3-6 najlepiej dopasowanych specjalizacji z podaniem procentowego dopasowania (0-100%).
  Dla każdej specjalizacji podaj krótkie uzasadnienie, dlaczego jest odpowiednia dla opisanych objawów.
  Im bardziej specjalizacja odpowiada opisanym objawom, tym wyższy procent dopasowania.
  `;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś specjalistą medycznym, który pomaga w identyfikacji odpowiednich specjalizacji lekarskich na podstawie objawów."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: specialtyMatchSchema
    });
    
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Otrzymano pustą odpowiedź od API');
    }
    
    const result = JSON.parse(content) as HealthQueryAnalysis;
    
    // Sortuj specjalizacje według procentu dopasowania
    result.specialtyMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Zwróć maksymalnie 3 najlepiej dopasowane specjalizacje
    result.specialtyMatches = result.specialtyMatches.slice(0, 3);
    
    return result;
    
  } catch (error) {
    console.error('Błąd podczas analizy zapytania zdrowotnego:', error);
    throw error;
  }
}
```

### 2.2. Implementacja serwisu pobierania lekarzy według specjalizacji

Rozszerzenie istniejącego serwisu `DoctorService` o metodę wyszukiwania lekarzy według specjalizacji:

```typescript
// src/services/doctorService.ts

// Dodaj do istniejącego serwisu DoctorService:

async getDoctorsBySpecialties(specialtyIds: string[]): Promise<DoctorDTO[]> {
  if (!specialtyIds.length) {
    return [];
  }
  
  // Pobierz lekarzy, którzy mają przynajmniej jedną z podanych specjalizacji
  const { data, error } = await this.supabase
    .from('doctors_specialties')
    .select(`
      doctor_id
    `)
    .in('specialty_id', specialtyIds);
    
  if (error) {
    throw new Error(`Błąd podczas pobierania lekarzy: ${error.message}`);
  }
  
  if (!data || !data.length) {
    return [];
  }
  
  // Pobierz pełne dane lekarzy
  const doctorIds = [...new Set(data.map(item => item.doctor_id))];
  
  const doctorsPromise = this.supabase
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
    .in('id', doctorIds)
    .eq('active', true);
    
  const { data: doctors, error: doctorsError } = await doctorsPromise;
  
  if (doctorsError) {
    throw new Error(`Błąd podczas pobierania danych lekarzy: ${doctorsError.message}`);
  }
  
  return doctors as DoctorDTO[];
}
```

### 2.3. Integracja dopasowania specjalizacji z wyszukiwaniem lekarzy

Utworzenie nowej funkcji w serwisie wyszukiwania, która połączy analizę zapytania z wyszukiwaniem lekarzy:

```typescript
// src/services/searchService.ts

import { analyzeHealthQueryWithSpecialties } from '../lib/openai';
import { DoctorService } from './doctorService';
import { supabase } from '../lib/supabase';
import { SearchResult } from '../types/search';
import { DoctorDTO } from '../types/dto';

export class SearchService {
  private doctorService: DoctorService;
  
  constructor() {
    this.doctorService = new DoctorService(supabase);
  }
  
  async searchDoctorsBySymptoms(query: string): Promise<SearchResult> {
    // Analiza zapytania i dopasowanie specjalizacji
    const analysis = await analyzeHealthQueryWithSpecialties(query);
    
    // Pobierz ID trzech najlepiej dopasowanych specjalizacji
    const topSpecialtyIds = analysis.specialtyMatches
      .slice(0, 3)
      .map(specialty => specialty.id);
    
    // Pobierz lekarzy z tymi specjalizacjami
    const doctors = await this.doctorService.getDoctorsBySpecialties(topSpecialtyIds);
    
    // Przypisz każdemu lekarzowi relevance_score na podstawie najwyższego dopasowania
    // jego specjalizacji do zapytania
    const doctorsWithScore: (DoctorDTO & { relevance_score: number })[] = doctors.map(doctor => {
      // Znajdź najwyższy wynik dopasowania spośród specjalizacji lekarza
      const doctorSpecialtyIds = doctor.specialties.map(s => s.id);
      
      // Znajdź najwyższy procent dopasowania dla specjalizacji lekarza
      let maxMatchPercentage = 0;
      for (const specialtyId of doctorSpecialtyIds) {
        const match = analysis.specialtyMatches.find(m => m.id === specialtyId);
        if (match && match.matchPercentage > maxMatchPercentage) {
          maxMatchPercentage = match.matchPercentage;
        }
      }
      
      return {
        ...doctor,
        relevance_score: maxMatchPercentage
      };
    });
    
    // Sortuj lekarzy według relevance_score (od najwyższego)
    doctorsWithScore.sort((a, b) => b.relevance_score - a.relevance_score);
    
    return {
      query,
      doctors: doctorsWithScore,
      analysis: {
        symptoms: analysis.symptoms,
        suggested_specialties: analysis.specialtyMatches.map(m => m.name)
      }
    };
  }
  
  // Zapisz historię wyszukiwania, jeśli użytkownik jest zalogowany
  async saveSearchHistory(userId: string, query: string, specialties: string[]): Promise<void> {
    await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query,
        specialties
      });
  }
}
```

## Etap 3: Integracja z interfejsem użytkownika i testowanie

### 3.1. Modyfikacja komponentu strony głównej

Aktualizacja komponentu `HomePage.tsx` do korzystania z nowego serwisu wyszukiwania:

```typescript
// src/pages/HomePage.tsx

// Zmodyfikuj istniejący kod w HomePage.tsx:

import { SearchService } from '../services/searchService';

// Wewnątrz komponentu HomePage:
const searchService = useMemo(() => new SearchService(), []);

const handleSearch = async (query: string) => {
  if (!user) {
    navigate('/login');
    return;
  }

  setIsLoading(true);
  setError(null);
  
  try {
    // Użyj nowego serwisu wyszukiwania
    const result = await searchService.searchDoctorsBySymptoms(query);
    
    setSearchResult(result);
    
    // Zapisz historię wyszukiwania, jeśli użytkownik jest zalogowany
    if (user) {
      await searchService.saveSearchHistory(
        user.id, 
        query, 
        result.analysis?.suggested_specialties || []
      );
    }
  } catch (error) {
    console.error('Błąd podczas wyszukiwania:', error);
    setError('Przepraszamy, wystąpił błąd podczas analizy zapytania. Spróbuj ponownie później.');
  } finally {
    setIsLoading(false);
  }
};
```

### 3.2. Rozbudowa komponentu analizy wyszukiwania

Aktualizacja komponentu `SearchAnalysisPanel.tsx` o wyświetlanie procentowego dopasowania specjalizacji:

```typescript
// src/components/search/SearchAnalysisPanel.tsx

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { SpecialtyMatch } from '../../types/search';

// Dodaj nowe styled components dla procentowego dopasowania
const SpecialtyList = styled.ul`
  margin-bottom: ${theme.spacing(2)};
  padding-left: 0;
  list-style: none;
`;

const SpecialtyItem = styled.li`
  margin-bottom: ${theme.spacing(1.5)};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1.5)};
`;

const SpecialtyName = styled.span`
  font-weight: ${theme.typography.fontWeightMedium};
  color: ${theme.colors.text.primary};
`;

const MatchPercentage = styled.div<{ percentage: number }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.small};
  overflow: hidden;
  min-width: 100px;
  max-width: 200px;
`;

const Progress = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => {
    if (props.percentage >= 80) return theme.colors.success.main;
    if (props.percentage >= 50) return theme.colors.primary.main;
    return theme.colors.warning.main;
  }};
`;

const PercentageValue = styled.span`
  font-weight: ${theme.typography.fontWeightBold};
  min-width: 50px;
`;

interface SearchAnalysisPanelProps {
  query: string;
  symptoms: string[];
  specialties: string[];
  specialtyMatches?: SpecialtyMatch[];
}

const SearchAnalysisPanel: React.FC<SearchAnalysisPanelProps> = ({ 
  query, 
  symptoms, 
  specialties,
  specialtyMatches = []
}) => {
  // Reszta kodu pozostaje bez zmian

  return (
    <PanelContainer>
      <PanelTitle>Analiza sztucznej inteligencji</PanelTitle>
      <QueryText>"{query}"</QueryText>
      
      {symptoms.length > 0 && (
        <>
          <ListTitle>Rozpoznane objawy</ListTitle>
          <List>
            {symptoms.map((symptom, index) => (
              <ListItem key={index}>{symptom}</ListItem>
            ))}
          </List>
        </>
      )}
      
      {specialtyMatches.length > 0 ? (
        <>
          <ListTitle>Sugerowane specjalizacje</ListTitle>
          <SpecialtyList>
            {specialtyMatches.map((specialty, index) => (
              <SpecialtyItem key={index}>
                <SpecialtyName>{specialty.name}</SpecialtyName>
                <MatchPercentage percentage={specialty.matchPercentage}>
                  <ProgressBar>
                    <Progress percentage={specialty.matchPercentage} />
                  </ProgressBar>
                  <PercentageValue>{specialty.matchPercentage}%</PercentageValue>
                </MatchPercentage>
              </SpecialtyItem>
            ))}
          </SpecialtyList>
        </>
      ) : specialties.length > 0 && (
        <>
          <ListTitle>Sugerowane specjalizacje</ListTitle>
          <List>
            {specialties.map((specialty, index) => (
              <ListItem key={index}>{specialty}</ListItem>
            ))}
          </List>
        </>
      )}
    </PanelContainer>
  );
};

export default SearchAnalysisPanel;
```

### 3.3. Testowanie i debugowanie

Plan testowania implementacji:

1. **Testy jednostkowe:**

   ```typescript
   // src/__tests__/services/searchService.test.ts
   
   import { SearchService } from '../../services/searchService';
   import { analyzeHealthQueryWithSpecialties } from '../../lib/openai';
   import { DoctorService } from '../../services/doctorService';
   
   // Mock dla zależności
   jest.mock('../../lib/openai');
   jest.mock('../../services/doctorService');
   
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
           // ... reszta pól doktora
         },
         {
           id: 'doc2',
           first_name: 'Anna',
           last_name: 'Nowak',
           specialties: [{ id: 'spec2', name: 'Okulista' }],
           // ... reszta pól doktora
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
       expect(result.doctors[0].relevance_score).toBe(90); // Neurolog
       expect(result.doctors[1].relevance_score).toBe(70); // Okulista
       expect(result.analysis.symptoms).toEqual(['ból głowy', 'zawroty głowy']);
       expect(result.analysis.suggested_specialties).toEqual(['Neurolog', 'Okulista', 'Internista']);
     });
   });
   ```

2. **Testy integracyjne:**

   ```typescript
   // src/__tests__/integration/healthQuery.test.ts
   
   import { analyzeHealthQueryWithSpecialties } from '../../lib/openai';
   
   describe('Integracja analizy zapytań zdrowotnych', () => {
     it('powinien zwracać strukturę zgodną ze schematem', async () => {
       // Ten test wymaga prawdziwego wywołania API OpenAI
       // Uruchamiać tylko w środowisku testowym lub z użyciem zmiennych środowiskowych
       
       const result = await analyzeHealthQueryWithSpecialties('Mam silne bóle głowy, zawroty i nudności od tygodnia');
       
       // Sprawdź zgodność struktury
       expect(result).toHaveProperty('symptoms');
       expect(result).toHaveProperty('specialtyMatches');
       expect(Array.isArray(result.symptoms)).toBe(true);
       expect(Array.isArray(result.specialtyMatches)).toBe(true);
       
       if (result.specialtyMatches.length > 0) {
         const firstMatch = result.specialtyMatches[0];
         expect(firstMatch).toHaveProperty('id');
         expect(firstMatch).toHaveProperty('name');
         expect(firstMatch).toHaveProperty('matchPercentage');
         expect(typeof firstMatch.matchPercentage).toBe('number');
         expect(firstMatch.matchPercentage).toBeGreaterThanOrEqual(0);
         expect(firstMatch.matchPercentage).toBeLessThanOrEqual(100);
       }
     });
   });
   ```

3. **Przykładowa sesja testowania:**

```
// Przykładowe wywołanie API:

URL: POST /api/health-analysis
Body: {
  "query": "Mam silne bóle brzucha po prawej stronie, nudności i gorączkę 39 stopni od wczoraj"
}

// Przykładowa odpowiedź:

{
  "symptoms": [
    "silne bóle brzucha po prawej stronie",
    "nudności",
    "gorączka 39 stopni"
  ],
  "specialtyMatches": [
    {
      "id": "7c9e7b7d-e8f9-4f1a-b97d-0ed721fed1e5",
      "name": "Gastroenterolog",
      "matchPercentage": 92,
      "reasoning": "Silne bóle brzucha, szczególnie zlokalizowane po prawej stronie, mogą wskazywać na problemy z przewodem pokarmowym, takie jak zapalenie wyrostka robaczkowego czy choroby wątroby lub dróg żółciowych."
    },
    {
      "id": "d1a2e3f4-5b6c-7d8e-9f0a-1b2c3d4e5f6g",
      "name": "Chirurg",
      "matchPercentage": 85,
      "reasoning": "Ostry ból brzucha w połączeniu z gorączką może wymagać interwencji chirurgicznej, np. w przypadku zapalenia wyrostka robaczkowego."
    },
    {
      "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "name": "Internista",
      "matchPercentage": 70,
      "reasoning": "Kompleks objawów wymaga ogólnej diagnostyki, którą może przeprowadzić lekarz internista przed skierowaniem do specjalisty."
    }
  ]
}
```

### Przykłady response_format dla OpenAI

1. Przykład prawidłowego żądania do OpenAI:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "Jesteś specjalistą medycznym, który pomaga w identyfikacji odpowiednich specjalizacji lekarskich na podstawie objawów."
    },
    {
      role: "user",
      content: `
      Przeanalizuj następujący opis objawów pacjenta i dopasuj najlepsze specjalizacje lekarskie.
      
      Objawy:
      "Mam silne bóle głowy, światłowstręt i nudności od tygodnia"
      
      Dostępne specjalizacje:
      [{"id":"1","name":"Neurolog"},{"id":"2","name":"Kardiolog"},{"id":"3","name":"Dermatolog"},{"id":"4","name":"Ortopeda"},{"id":"5","name":"Okulista"},{"id":"6","name":"Gastroenterolog"},{"id":"7","name":"Internista"}]
      
      Zwróć listę zidentyfikowanych objawów oraz 3-6 najlepiej dopasowanych specjalizacji z podaniem procentowego dopasowania (0-100%).
      Dla każdej specjalizacji podaj krótkie uzasadnienie, dlaczego jest odpowiednia dla opisanych objawów.
      `
    }
  ],
  temperature: 0.3,
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'specialtyMatches',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          symptoms: {
            type: 'array',
            items: { type: 'string' }
          },
          specialtyMatches: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                matchPercentage: { type: 'number', minimum: 0, maximum: 100 },
                reasoning: { type: 'string' }
              },
              required: ['id', 'name', 'matchPercentage']
            }
          }
        },
        required: ['symptoms', 'specialtyMatches']
      }
    }
  }
});
```

2. Przykład oczekiwanej odpowiedzi z OpenAI:

```json
{
  "symptoms": [
    "silne bóle głowy",
    "światłowstręt",
    "nudności"
  ],
  "specialtyMatches": [
    {
      "id": "1",
      "name": "Neurolog",
      "matchPercentage": 95,
      "reasoning": "Neurolog jest najlepszym wyborem dla pacjenta z bólami głowy, zwłaszcza gdy towarzyszą im światłowstręt i nudności, które są charakterystyczne dla migreny lub innych schorzeń neurologicznych."
    },
    {
      "id": "5",
      "name": "Okulista",
      "matchPercentage": 75,
      "reasoning": "Światłowstręt może wskazywać na problemy oczne, które mogą być przyczyną lub skutkiem bólów głowy."
    },
    {
      "id": "7",
      "name": "Internista",
      "matchPercentage": 60,
      "reasoning": "Internista może przeprowadzić podstawową diagnostykę i skierować do odpowiedniego specjalisty, jeśli objawy wymagają głębszego zbadania."
    }
  ]
}
```

3. Przykład wykorzystania odpowiedzi w kodzie:

```typescript
// Obsługa wyniku analizy
const result = JSON.parse(content) as HealthQueryAnalysis;

// Pobierz ID trzech najlepiej dopasowanych specjalizacji
const topSpecialtyIds = result.specialtyMatches
  .filter(match => match.matchPercentage >= 60) // Opcjonalne filtrowanie minimalnego progu
  .slice(0, 3)
  .map(specialty => specialty.id);

console.log('Najlepiej dopasowane specjalizacje:', topSpecialtyIds);
// Przykładowy output: ['1', '5', '7']
```
