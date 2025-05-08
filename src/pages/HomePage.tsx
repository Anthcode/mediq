import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container } from '../components/common/Container';
import { theme } from '../styles/theme';
import SearchBar from '../components/search/SearchBar';
import DoctorsList from '../components/doctors/DoctorsList';
import SearchAnalysisPanel from '../components/search/SearchAnalysisPanel';
import { SearchResult, SearchAnalysis } from '../types/search';
import { LoadingSpinner, LoadingContainer } from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { DoctorService } from '../services/doctorService';
import { supabase } from '../lib/supabase';
import { searchService } from '../services/searchService';

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

const ResultsTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: ${theme.spacing(1)};
`;

const ResultsCount = styled.p`
  color: ${theme.colors.text.secondary};
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
  font-size: .875rem ;
`;

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const doctorService = useMemo(() => new DoctorService(supabase), []);

  const handleSearch = async (query: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchService.analyzeHealthQuery(query);
      
      // Pobierz lekarzy na podstawie nazw specjalizacji
      const doctors = await doctorService.getDoctorsBySpecialtyNames(
        result.analysis?.suggested_specialties.map((specialty: SearchAnalysis['suggested_specialties'][0]) => specialty.name) || []
      );

      setSearchResult({
        query,
        doctors: doctors.map(doctor => {
          const matchingSpecialty = result.analysis?.suggested_specialties.find(
            specialty => doctor.specialties?.some(s => s.name === specialty.name)
          );
          const matchPercent = matchingSpecialty?.matchPercentage || 0;
          return {
            ...doctor,
            matchPercentage: matchPercent,
            relevance_score: matchPercent, // maintain compatibility with existing type
            best_matching_specialty: matchingSpecialty ? {
              id: matchingSpecialty.name.toLowerCase().replace(/\s+/g, '-'),
              name: matchingSpecialty.name,
              matchPercentage: matchingSpecialty.matchPercentage,
              reasoning: matchingSpecialty.reasoning
            } : null
          };
        }),
        analysis: result.analysis
      });

      // Zapisz historię wyszukiwania
      if (user) {
        await searchService.saveSearchHistory(
          user.id, 
          query, 
          result.analysis?.suggested_specialties.map((specialty: SearchAnalysis['suggested_specialties'][0]) => specialty.name) || []
        );
      }
    } catch (error) {
      console.error('Błąd podczas wyszukiwania:', error);
      setError('Przepraszamy, wystąpił błąd podczas analizy zapytania. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner size="large" />
          </LoadingContainer>
        )}
        
        {!isLoading && searchResult && user && (
          <ResultsContainer>
            <ResultsHeader>
              <ResultsTitle>Rekomendowani lekarze</ResultsTitle>
              <ResultsCount>
                Znaleziono {searchResult.analysis?.suggested_specialties.length} specjalistów dla Twojego problemu zdrowotnego
              </ResultsCount>
            </ResultsHeader>
            
            {searchResult.analysis && (
              <SearchAnalysisPanel 
                query={searchResult.query}
                symptoms={searchResult.analysis.symptoms}
                specialties={searchResult.analysis.suggested_specialties.map(s => s.name)}
                specialtyMatches={searchResult.analysis.suggested_specialties.map(specialty => ({
                  id: specialty.name.toLowerCase().replace(/\s+/g, '-'),
                  name: specialty.name,
                  matchPercentage: specialty.matchPercentage,
                  reasoning: specialty.reasoning
                }))}
              />
            )}
            
            <DoctorsList doctors={searchResult.doctors} />
          </ResultsContainer>
        )}
      </Container>
    </HomeContainer>
  );
};

export default HomePage;