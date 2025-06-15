import React from 'react';
import styled from 'styled-components';
import { AIBadge } from '../../components/common/AIBadge';
import { AITooltip } from '../../components/common/AITooltip';
import DoctorsList from './DoctorsList';
import { DoctorDTO } from '../../types/dto';
import { theme } from '../../styles/theme';

const RecommendationsContainer = styled.div`
  margin-top: ${theme.spacing(4)};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3)};
  padding: ${theme.spacing(2)} 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const AIIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

interface DoctorRecommendationsProps {
  doctors: DoctorDTO[];
}

export const DoctorRecommendations: React.FC<DoctorRecommendationsProps> = ({ doctors }) => {
  return (
    <RecommendationsContainer>
      <SectionHeader>
        <SectionTitle>Rekomendowani lekarze</SectionTitle>
        <AIIndicatorContainer>
          <AITooltip 
            content="Lekarze zostali dobrani przez AI na podstawie Twoich objawów i posortowani według stopnia dopasowania"
            position="left"
          >
            <AIBadge 
              variant="secondary" 
              label="Dopasowanie AI" 
              size="small"
              animated={true}
            />
          </AITooltip>
        </AIIndicatorContainer>
      </SectionHeader>
      
      <DoctorsList doctors={doctors} />
    </RecommendationsContainer>
  );
};