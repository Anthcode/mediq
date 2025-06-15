import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../components/common/Container';
import { theme } from '../styles/theme';
import DoctorDetail from '../components/doctors/DoctorDetail';
import { Button } from '../components/common/Button';
import { LoadingContainer, LoadingSpinner } from '../components/common/LoadingSpinner';
import { DoctorDTO } from '../types/dto';
import { DoctorService } from '../services/doctorService';
import { supabase } from '../lib/supabase';

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
  
  // Przenosimy utworzenie instancji serwisu poza useEffect
  const doctorService = useMemo(() => new DoctorService(supabase), []);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        const doctorData = await doctorService.getDoctorById(id);
        setDoctor(doctorData);
      } catch (error) {
        console.error('Błąd podczas pobierania danych lekarza:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id, doctorService]); // dodajemy doctorService jako zależność
  
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
          $variant="text" 
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