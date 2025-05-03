import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../components/common/Container';
import { theme } from '../styles/theme';
import DoctorDetail from '../components/doctors/DoctorDetail';
import { Button } from '../components/common/Button';
import { LoadingContainer, LoadingSpinner } from '../components/common/LoadingSpinner';
import { mockDoctors } from '../data/mockData';
import { DoctorDTO } from '../types/dto';

const DetailPageContainer = styled.div`
  padding: ${theme.spacing(4)} 0;
`;

const BackButton = styled(Button)`
  margin-bottom: ${theme.spacing(4)};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing(8)};
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.error.main};
  margin-bottom: ${theme.spacing(2)};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing(4)};
`;

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // W rzeczywistej implementacji byłoby to zapytanie do Supabase
        const foundDoctor = mockDoctors.find(d => d.id === id);
        
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych lekarza:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);
  
  if (loading) {
    return (
      <LoadingContainer $fullpage>
        <LoadingSpinner size="large" />
      </LoadingContainer>
    );
  }
  
  if (error || !doctor) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorTitle>Nie znaleziono lekarza</ErrorTitle>
          <ErrorMessage>
            Nie mogliśmy znaleźć szukanego lekarza. Być może zmienił praktykę lub link jest nieprawidłowy.
          </ErrorMessage>
          <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
        </ErrorContainer>
      </Container>
    );
  }
  
  return (
    <DetailPageContainer>
      <Container $maxWidth="md">
        <BackButton 
          variant="text" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} style={{ marginRight: '4px' }} />
          Wróć do wyników wyszukiwania
        </BackButton>
        
        <DoctorDetail doctor={doctor} />
      </Container>
    </DetailPageContainer>
  );
};

export default DoctorDetailPage;