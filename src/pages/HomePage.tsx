import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container } from '../components/common/Container';
import { theme } from '../styles/theme';
import SearchBar from '../components/search/SearchBar';
import DoctorsList from '../components/doctors/DoctorsList';
import SearchAnalysisPanel from '../components/search/SearchAnalysisPanel';
import { mockDoctors } from '../data/mockData';
import { SearchResult } from '../types';
import { LoadingSpinner, LoadingContainer } from '../components/common/LoadingSpinner';
import { analyzeHealthQuery } from '../lib/openai';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

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
  color: white;
  font-size: 2rem;
  margin-bottom: ${theme.spacing(2)};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 3rem;
  }
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
  padding: ${theme.spacing(4)};
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
`;

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async (query: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeHealthQuery(query);
      
      const matchedDoctors = mockDoctors
        .map(doctor => ({
          ...doctor,
          relevance_score: analysis.relevance_scores[doctor.id] || 0
        }))
        .filter(doctor => doctor.relevance_score > 20)
        .sort((a, b) => b.relevance_score - a.relevance_score);

      setSearchResult({
        doctors: matchedDoctors,
        query,
        analysis: {
          symptoms: analysis.symptoms,
          suggested_specialties: analysis.suggested_specialties
        }
      });
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
                Znaleziono {searchResult.doctors.length} specjalistów dla Twojego problemu zdrowotnego
              </ResultsCount>
            </ResultsHeader>
            
            {searchResult.analysis && (
              <SearchAnalysisPanel 
                query={searchResult.query}
                symptoms={searchResult.analysis.symptoms}
                specialties={searchResult.analysis.suggested_specialties}
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