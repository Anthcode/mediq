import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TabListContainer = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(4)};
  border-bottom: 1px solid ${theme.colors.text.primary};
`;

interface TabProps {
  $isActive: boolean;
}

export const Tab = styled.button<TabProps>`
  padding: ${theme.spacing(2)} ${theme.spacing(4)};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.$isActive 
    ? theme.colors.primary.main 
    : 'transparent'};
  color: ${props => props.$isActive 
    ? theme.colors.text.primary 
    : theme.colors.text.secondary};
  font-weight: ${props => props.$isActive 
    ? theme.typography.fontWeightMedium 
    : theme.typography.fontWeightRegular};
  cursor: pointer;
  transition: all ${theme.transitions.short};

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

interface TabListProps {
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ children }) => {
  return (
    <TabListContainer>
      {children}
    </TabListContainer>
  );
};
