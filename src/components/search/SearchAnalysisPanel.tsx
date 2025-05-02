import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

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

interface SearchAnalysisPanelProps {
  query: string;
  symptoms: string[];
  specialties: string[];
}

const SearchAnalysisPanel: React.FC<SearchAnalysisPanelProps> = ({ 
  query, 
  symptoms, 
  specialties 
}) => {
  return (
    <PanelContainer>
      <PanelTitle>Analiza sztucznej inteligencji</PanelTitle>
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
      
      {specialties.length > 0 && (
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