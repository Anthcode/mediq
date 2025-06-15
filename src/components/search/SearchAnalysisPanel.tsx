import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { SpecialtyMatch } from '../../types/search';

const PanelContainer = styled.div`
  background-color: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(4)};
  border-left: 4px solid ${theme.colors.primary.main};
`;

const PanelTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${theme.spacing(2)};
  color: ${theme.colors.primary.dark};
`;

const ListTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.text.primary};
`;

const List = styled.ul`
  margin-bottom: ${theme.spacing(2)};
  padding-left: ${theme.spacing(2.5)};
`;

const ListItem = styled.li`
  margin-bottom: ${theme.spacing(0.5)};
  color: ${theme.colors.text.secondary};
`;

const QueryText = styled.p`
  font-style: italic;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing(3)};
  padding: ${theme.spacing(1.5)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.small};
  border-left: 3px solid ${theme.colors.secondary.main};
`;

const SpecialtyList = styled.ul`
  margin-bottom: ${theme.spacing(2)};
  padding-left: 0;
  list-style: none;
`;

const SpecialtyItem = styled.li`
  margin-bottom: ${theme.spacing(1.5)};
  padding: ${theme.spacing(2)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`;

const SpecialtyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SpecialtyName = styled.span`
  font-weight: ${theme.typography.fontWeightMedium};
  color: ${theme.colors.text.primary};
`;

const MatchPercentage = styled.div<{ $percentage: number }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.small};
  overflow: hidden;
  min-width: 100px;
  max-width: 200px;
`;

const Progress = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background-color: ${props => {
    if (props.$percentage >= 80) return theme.colors.success.main;
    if (props.$percentage >= 50) return theme.colors.primary.main;
    return theme.colors.warning.main;
  }};
  transition: width 0.3s ease-in-out;
`;

const PercentageValue = styled.span`
  font-weight: ${theme.typography.fontWeightBold};
  min-width: 50px;
`;

const Reasoning = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
`;

interface SearchAnalysisPanelProps {
  query: string;
  symptoms: string[];
  specialties: string[];
  specialtyMatches?: SpecialtyMatch[];
}

const SearchAnalysisPanel: React.FC<SearchAnalysisPanelProps> = ({ 
  query, 
  symptoms, 
  specialties,
  specialtyMatches = []
}) => {
  return (
    <PanelContainer>
      <PanelTitle>✨ Analiza sztucznej inteligencji</PanelTitle>
      <QueryText>"{query}"</QueryText>
      
      {symptoms.length > 0 && (
        <>
          <ListTitle>Rozpoznane objawy</ListTitle>
          <List>
            {symptoms.map((symptom, index) => (
              <ListItem key={index}>{symptom}</ListItem>
            ))}
          </List>
        </>
      )}
      
      {specialtyMatches.length > 0 ? (
        <>
          <ListTitle>Sugerowane specjalizacje</ListTitle>
          <SpecialtyList>
            {specialtyMatches.map(specialty => (
              <SpecialtyItem key={specialty.id}>
                <SpecialtyHeader>
                  <SpecialtyName>{specialty.name}</SpecialtyName>
                  <MatchPercentage $percentage={specialty.matchPercentage}>
                    <ProgressBar>
                      <Progress $percentage={specialty.matchPercentage} />
                    </ProgressBar>
                    <PercentageValue>{specialty.matchPercentage}%</PercentageValue>
                  </MatchPercentage>
                </SpecialtyHeader>
                {specialty.reasoning && (
                  <Reasoning>{specialty.reasoning}</Reasoning>
                )}
              </SpecialtyItem>
            ))}
          </SpecialtyList>
        </>
      ) : specialties.length > 0 && (
        <>
          <ListTitle>Sugerowane specjalizacje</ListTitle>
          <List>
            {specialties.map((specialty, index) => (
              <ListItem key={index}>{specialty}</ListItem>
            ))}
          </List>
        </>
      )}
    </PanelContainer>
  );
};

export default SearchAnalysisPanel;