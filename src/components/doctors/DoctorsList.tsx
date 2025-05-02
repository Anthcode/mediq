import React from 'react';
import styled from 'styled-components';
import DoctorCard from './DoctorCard';
import { Doctor } from '../../types';
import { theme } from '../../styles/theme';

const ListContainer = styled.div`
  margin-top: ${theme.spacing(4)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing(3)};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing(6)} ${theme.spacing(3)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing(4)};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing(2)};
  color: ${theme.colors.text.primary};
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

interface DoctorsListProps {
  doctors: Doctor[];
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors }) => {
  if (!doctors.length) {
    return (
      <EmptyState>
        <EmptyStateTitle>Nie znaleziono lekarzy</EmptyStateTitle>
        <EmptyStateText>
          Nie znaleźliśmy żadnych lekarzy spełniających podane kryteria. Spróbuj zmienić kryteria wyszukiwania lub opisać problem innymi słowami.
        </EmptyStateText>
      </EmptyState>
    );
  }
  
  return (
    <ListContainer>
      <Grid>
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </Grid>
    </ListContainer>
  );
};

export default DoctorsList;