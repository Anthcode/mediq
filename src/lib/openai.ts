import OpenAI from 'openai';
import { SpecialtyService } from '../services/specialtyService';
import { HealthQueryAnalysis } from '../types/search';

const openaiClient = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeHealthQueryWithSpecialties(query: string): Promise<HealthQueryAnalysis> {
  const specialtyService = new SpecialtyService();
  const allSpecialties = await specialtyService.getAllSpecialties();
 
  // Uzyskanie listy dostępnych specjalizacji z bazy danych
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
 
  Dla każdej dostępnej specjalizacji musisz użyć dokładnie takiego samego id jak w podanej liście dostępnych specjalizacji.
  Zwróć listę zidentyfikowanych objawów oraz 3 najlepiej dopasowane specjalizacje.
  Dla każdej specjalizacji podaj procentowe dopasowanie jako liczbę od 0 do 100.
  Dla każdej specjalizacji podaj krótkie uzasadnienie, dlaczego jest odpowiednia dla opisanych objawów.
  `;
 
  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś specjalistą medycznym, który pomaga w identyfikacji odpowiednich specjalizacji lekarskich na podstawie objawów.
          Musisz dokładnie używać identyfikatorów z dostarczonej listy specjalizacji - nie twórz wymyślonych identyfikatorów.
          Zawsze odpowiadaj dokładnie w następującym formacie JSON:
          {
            "symptoms": ["objaw1", "objaw2", ...],
            "specialtyMatches": [
              {
                "id": "rzeczywiste_id_z_listy",
                "name": "nazwa_specjalizacji",
                "matchPercentage": liczba_od_0_do_100,
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
      temperature: 0.3,
      
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
    
    // Weryfikacja czy każda specjalizacja ma poprawne ID z naszej bazy
    result.specialtyMatches = result.specialtyMatches.filter(match => 
      allSpecialties.some(s => s.id === match.id)
    );
    
    console.log('OpenAI Analysis:', result);
   
    return result;
   
  } catch (error) {
    console.error('Błąd podczas analizy zapytania zdrowotnego:', error);
    throw error;
  }
}