import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AnalysisResult {
  symptoms: string[];
  suggested_specialties: string[];
  relevance_scores: Record<string, number>;
  specialty_info: string | null;
}

export const analyzeHealthQuery = async (query: string): Promise<AnalysisResult> => {

   // Calculate relevance scores for doctors based on specialties
   const relevanceScores: Record<string, number> = {};
   const doctorSpecialties = {
     "1": "Neurolog",
     "2": "Kardiolog",
     "3": "Dermatolog",
     "4": "Ortopeda",
     "5": "Okulista"
   };

  if (!query) {
    throw new Error('Query is required');
  }

  // Normalize the query
  query = query.trim().toLowerCase();
  if (query.length < 3) {
    throw new Error('Query must be at least 3 characters long');
  }
  if (query.length > 100) {
    throw new Error('Query must be less than 100 characters long');
  }

  const directSpecialtyMatch = Object.entries(doctorSpecialties).find(([id, specialty]) => {
    const specialtyLower = specialty.toLowerCase();
    return query === specialtyLower || query.includes(specialtyLower) || specialtyLower.includes(query);
  });
  if (directSpecialtyMatch) {
    // If the query is a direct match to a specialty, return it immediately
    const matchedId = directSpecialtyMatch[0];
    const matchedSpecialty = directSpecialtyMatch[1]; 
    return {
      symptoms: [],
      suggested_specialties: [matchedSpecialty],
      relevance_scores: { [matchedId]: 100 },
      specialty_info: null
    };
  }
  // If the query is not a direct match, proceed with OpenAI analysis


  try {
    console.log('Sending query to OpenAI:', query);
    const startTime = performance.now();
    
    // Nowy, zmodyfikowany prompt systemowy
    const prompt = `Przeanalizuj następujące zapytanie i odpowiedz zgodnie z poniższymi instrukcjami:

1. Jeśli zapytanie to nazwa specjalizacji lekarskiej (np. "kardiolog", "neurolog"), zwróć informacje o tej specjalizacji w formacie JSON:
{
  "symptoms": [],
  "suggested_specialties": ["nazwa_specjalizacji"],
  "specialty_info": "opis czym zajmuje się dany specjalista, jakie choroby leczy, kiedy należy się do niego udać"
}

2. Jeśli zapytanie to opis dolegliwości pacjenta, zidentyfikuj objawy i sugerowane specjalizacje lekarskie w formacie JSON:
{
  "symptoms": ["objaw1", "objaw2"],
  "suggested_specialties": ["specjalizacja1", "specjalizacja2"],
  "specialty_info": null
}

Zapytanie: "${query}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ]
    });
    const endTime = performance.now();
    console.log('OpenAI response time:', `${(endTime - startTime).toFixed(2)}ms`);
    console.log('OpenAI response:', completion.choices[0].message.content);
    
    // Parse the JSON response
    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content || '{"symptoms":[],"suggested_specialties":[],"specialty_info":null}');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      aiResponse = {
        symptoms: [],
        suggested_specialties: [],
        specialty_info: null,
        
      };
    }

   
    // Calculate scores based on specialty matches
    for (const [doctorId, specialty] of Object.entries(doctorSpecialties)) {
      let score = 0;
      const specialtyLower = specialty.toLowerCase();
      
      // Direct specialty match
      if (aiResponse.suggested_specialties.some((s: string): boolean => s.toLowerCase() === specialtyLower
      )) {
        score += 50;
      }

      // Related specialty match
      if (aiResponse.suggested_specialties.some((s: string): boolean => 
        specialtyLower.includes(s.toLowerCase()) ||
        s.toLowerCase().includes(specialtyLower)
      )) {
        score += 30;
      }

      // Symptom relevance
      const relevantSymptoms = {
        "Neurolog": ["ból głowy", "zawroty głowy", "migrena", "drętwienie"],
        "Kardiolog": ["ból w klatce", "duszność", "kołatanie serca"],
        "Dermatolog": ["wysypka", "świąd", "zmiany skórne"],
        "Ortopeda": ["ból stawów", "ból pleców", "ból kręgosłupa"],
        "Okulista": ["ból oczu", "zaburzenia widzenia", "łzawienie"]
      };

      const specialistSymptoms = relevantSymptoms[specialty as keyof typeof relevantSymptoms] || [];
      
      for (const symptom of aiResponse.symptoms) {
        if (specialistSymptoms.some(s => 
          symptom.toLowerCase().includes(s.toLowerCase())
        )) {
          score += 20;
        }
      }

      // Add small random factor to avoid identical scores
      score += Math.floor(Math.random() * 10);
      
      // Cap the score at 100
      relevanceScores[doctorId] = Math.min(score, 100);
    }

    const result: AnalysisResult = {
      symptoms: aiResponse.symptoms,
      suggested_specialties: aiResponse.suggested_specialties,
      relevance_scores: relevanceScores,
      specialty_info: aiResponse.specialty_info || null
    };

    console.log('Final analysis result:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing health query:', error);
    throw error;
  }
};