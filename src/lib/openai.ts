import OpenAI from 'openai';
import { supabase } from './supabase';
import { HealthQueryAnalysis } from '../types/search';

const openaiClient = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
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
 
  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
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
      max_tokens: 800
      
    });
   
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Otrzymano pustą odpowiedź od API');
    }
   
    const result = JSON.parse(content) as HealthQueryAnalysis;
    
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