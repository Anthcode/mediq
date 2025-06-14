import OpenAI from 'openai';
import { supabase } from './supabase';
import { HealthQueryAnalysis } from '../types/search';

const openaiClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': window.location.origin
  }
});



// Funkcja pobierająca unikalne specjalizacje lekarzy z bazy
export async function fetchUniqueDoctorSpecialties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('specialties');
  if (error) throw new Error('Błąd pobierania specjalizacji: ' + error.message);
  // Rozdziel tekstowe specjalizacje na unikalne wartości
  const all = (data || [])
    .map(row => row.specialties)
    .filter(Boolean)
    .flatMap((s: string) => s.split(',').map((x: string) => x.trim()).filter(Boolean));
  return Array.from(new Set(all)).sort();
}

export async function analyzeHealthQueryWithSpecialties(query: string): Promise<HealthQueryAnalysis> {
  // Pobierz unikalne specjalizacje z bazy
  const specialtiesArr = await fetchUniqueDoctorSpecialties();
  const specjalizationsList = specialtiesArr.join(', ');

  const prompt = `
  Przeanalizuj następujący opis objawów pacjenta i dopasuj najlepsze specjalizacje lekarskie.
  
  Objawy:
  "${query}"

  Wybierz TYLKO 3 najlepsze specjalizacje z poniższej listy:
  "${specjalizationsList}"
  
  Dla każdej dostępnej specjalizacji musisz użyć dokładnie takiego samego id jak w podanej liście dostępnych specjalizacji.
  Zwróć listę zidentyfikowanych objawów oraz 3 najlepiej dopasowane specjalizacje.
  Dla każdej specjalizacji podaj procentowe dopasowanie jako liczbę od 60 do 100.
  Dla każdej specjalizacji podaj krótkie uzasadnienie, dlaczego jest odpowiednia dla opisanych objawów.
  `;
     // model: "gpt-4o-mini",
  try {
    const completion = await openaiClient.chat.completions.create({
  
      model: "google/gemini-2.0-flash-exp:free",
            messages: [
        {
          role: "system",
          content: `Jesteś specjalistą medycznym, który pomaga w identyfikacji odpowiednich specjalizacji lekarskich na podstawie objawów.
          Zawsze odpowiadaj dokładnie w następującym formacie JSON:
          {
            "symptoms": ["objaw1", "objaw2", ...],
            "specialtyMatches": [
              {
                "name": "nazwa_specjalizacji",
                "matchPercentage": liczba_od_60_do_100,
                "reasoning": "uzasadnienie"
              },
              ...
            ]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
     // max_tokens: 800
      
    });
   
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Otrzymano pustą odpowiedź od API');
    }
    
   // Sprawdź czy odpowiedź została obcięta
const finishReason = completion.choices[0].finish_reason;
if (finishReason === 'length') {
  console.warn('Odpowiedź została obcięta z powodu limitu tokenów');
}

// Wyczyść content z markdown i niepełnych fragmentów
let cleanContent = content.trim();
if (cleanContent.startsWith('```json')) {
  cleanContent = cleanContent.replace(/^```json\s*/, '');
}
if (cleanContent.endsWith('```')) {
  cleanContent = cleanContent.replace(/```$/, '');
}

// Jeśli JSON jest niepełny, spróbuj go naprawić
if (!cleanContent.endsWith('}')) {
  // Znajdź ostatni kompletny obiekt w specialtyMatches
  const lastCompleteMatch = cleanContent.lastIndexOf('},');
  if (lastCompleteMatch !== -1) {
    cleanContent = cleanContent.substring(0, lastCompleteMatch + 1) + ']}';
  } else {
    // Jeśli nie ma żadnego kompletnego obiektu, dodaj podstawową strukturę
    cleanContent = cleanContent + ']}';
  }
}

    const result = JSON.parse(cleanContent) as HealthQueryAnalysis;
    
    // Walidacja i korekta wartości matchPercentage
    result.specialtyMatches = result.specialtyMatches.map(match => {
      const percentage = match.matchPercentage;
      match.matchPercentage = Math.max(0, Math.min(100, percentage));
      return match;
    });
    
    // Sortowanie według stopnia dopasowania
    result.specialtyMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    

    
    console.log('OpenAI Analysis:', result);
   
    return result;
   
  } catch (error) {
    console.error('Błąd podczas analizy zapytania zdrowotnego:', error);
    throw error;
  }
}