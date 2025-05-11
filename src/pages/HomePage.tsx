import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container } from '../components/common/Container';
import { theme } from '../styles/theme';
import SearchBar from '../components/search/SearchBar';
import DoctorsList from '../components/doctors/DoctorsList';
import SearchAnalysisPanel from '../components/search/SearchAnalysisPanel';
import { SearchResult, SpecialtyMatch } from '../types/search';
import { LoadingSpinner, LoadingContainer } from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { DoctorService } from '../services/doctorService';
import { supabase } from '../lib/supabase';
import { analyzeHealthQueryWithSpecialties } from '../lib/openai';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeContainer = styled.div`
  min-height: calc(100vh - 250px);
`;

const HeroSection = styled.section`
  padding: ${theme.spacing(10)} ${theme.spacing(2)};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.light} 0%,
    ${theme.colors.primary.main} 100%
  );
  text-align: center;
  margin-bottom: ${theme.spacing(6)};
`;

const Title = styled.h1`
  color: ${theme.colors.background.paper};
  font-size: 2rem;
  margin-bottom: ${theme.spacing(2)};
  max-width: 800px;
  margin: 0 auto ${theme.spacing(3)} auto;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto ${theme.spacing(6)} auto;
`;

const ResultsContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const ResultsHeader = styled.div`
  margin-bottom: ${theme.spacing(3)};
`;

const ResultCount = styled.h2`
  font-size: 1.25rem;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing(2)};
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.error.light};
  color: ${theme.colors.error.dark};
  padding: ${theme.spacing(2)};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing(3)};
  text-align: center;
`;

const UnauthorizedMessage = styled.div`
  text-align: center;
  background-color: ${theme.colors.background.paper};
  padding: ${theme.spacing(2)};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing(4)};
`;

const UnauthorizedTitle = styled.h2`
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing(2)};
`;

const UnauthorizedText = styled.p`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing(3)};
  font-size: .875rem;
`;

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  //const doctorService = useMemo(() => new DoctorService(supabase), []);

  const handleSearch = async (query: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeHealthQueryWithSpecialties(query);
      if (!result) {
        setError('Nie znaleziono wyników dla podanego zapytania.');
        return;
      }


      
      // Wyciągnięcie nazw specjalizacji
      const specialtyNames = result.specialtyMatches.map((specialty: { name: string }) => specialty.name);


      // Pobierz wszystkich lekarzy i filtruj po polu specialties (string)
      const doctorService = new DoctorService(supabase);
      const doctors = await doctorService.getDoctorsBySpecialtyName(specialtyNames);

      if (!doctors || doctors.length === 0) {
        setError('Nie znaleziono lekarzy dla podanego zapytania.');
        return;
      }
      // Zapisz wyniki wyszukiwania w tabeli 



     

      const doctorsWithRelevance = doctors.map(doctor => {
        const bestMatch = result.specialtyMatches.find((specialty: { name: string; matchPercentage: number; reasoning?: string }) => 
          doctor.specialties && doctor.specialties.toLowerCase().includes(specialty.name.toLowerCase())
        );
        return {
          ...doctor,
          relevance_score: bestMatch ? bestMatch.matchPercentage : 0,
          matchPercentage: bestMatch ? bestMatch.matchPercentage : undefined, // <-- dodajemy matchPercentage
          best_matching_specialty: bestMatch ? {
            id: bestMatch.id,
            name: bestMatch.name,
            matchPercentage: bestMatch.matchPercentage,
            reasoning: bestMatch.reasoning
          } : null
        };
      });

      // Sortuj lekarzy według stopnia dopasowania (od najwyższego do najniższego)
      doctorsWithRelevance.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

      // Przygotuj dopasowania specjalizacji dla panelu analizy
      const specialtyMatchesForPanel: SpecialtyMatch[] = result.specialtyMatches.map(specialty => ({
        id: specialty.id || specialty.name.toLowerCase().replace(/\s+/g, '-'),
        name: specialty.name,
        matchPercentage: specialty.matchPercentage,
        reasoning: specialty.reasoning || ''
      }));

      // Ustaw wynik wyszukiwania
      setSearchResult({
        query,
        doctors: doctorsWithRelevance,
        analysis: {
          symptoms: result.symptoms,
          suggested_specialties: specialtyMatchesForPanel.map(specialty => ({
            name: specialty.name,
            reasoning: specialty.reasoning || '',
            matchPercentage: specialty.matchPercentage
          }))
        }
      });

    } catch (error) {
      console.error('Błąd podczas wyszukiwania:', error);
      setError('Przepraszamy, wystąpił błąd podczas analizy zapytania. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderowanie wyników wyszukiwania dla komponentu 
  const renderSearchResults = () => {
    if (!searchResult?.analysis) return null;

    const specialtyMatches: SpecialtyMatch[] = searchResult.analysis.suggested_specialties.map(specialty => ({
      id: specialty.name.toLowerCase().replace(/\s+/g, '-'),
      name: specialty.name,
      matchPercentage: specialty.matchPercentage,
      reasoning: specialty.reasoning
    }));

    return (
      <ResultsContainer>
        <ResultsHeader>
          <ResultCount>
            Znaleziono {searchResult.doctors.length} lekarzy dla Twojego problemu zdrowotnego
          </ResultCount>
        </ResultsHeader>
        
        <SearchAnalysisPanel 
          query={searchResult.query}
          symptoms={searchResult.analysis.symptoms}
          specialties={searchResult.analysis.suggested_specialties.map(s => s.name)}
          specialtyMatches={specialtyMatches}
        />
        
        <DoctorsList doctors={searchResult.doctors}  />
      </ResultsContainer>
    );
  };

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <Title>Znajdź odpowiedniego lekarza dla swoich potrzeb zdrowotnych</Title>
          <Subtitle>
            Opisz swoje objawy lub problem zdrowotny, a nasza sztuczna inteligencja pomoże Ci znaleźć najlepszych specjalistów.
          </Subtitle>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {!user && (
            <UnauthorizedMessage>
              <UnauthorizedTitle>Zaloguj się, aby wyszukać lekarza</UnauthorizedTitle>
              <UnauthorizedText>
                Aby skorzystać z wyszukiwania i otrzymać spersonalizowane rekomendacje lekarzy, musisz być zalogowany.
              </UnauthorizedText>
              <Button 
                onClick={() => navigate('/login')}
                variant="primary"
                size="small"
                style={{ marginTop: theme.spacing(1) }}
              >
                Zaloguj się
              </Button>
            </UnauthorizedMessage>
          )}
        </Container>
      </HeroSection>
      
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner size="large" />
          </LoadingContainer>
        )}
        
        {!isLoading && searchResult && user && renderSearchResults()}
      </Container>
    </HomeContainer>
  );
};

export default HomePage;