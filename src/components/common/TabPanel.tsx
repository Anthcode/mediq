import React from 'react';
import styled from 'styled-components';

interface TabPanelProps {
  $isActive: boolean;
  children: React.ReactNode;
}

const TabPanelContainer = styled.div<TabPanelProps>`
  display: ${props => ( props.$isActive  ? 'block' : 'none')};
`

export const TabPanel: React.FC<TabPanelProps> = ({ $isActive, children }) => {
  return (
    <TabPanelContainer $isActive={$isActive}>
      {children}
    </TabPanelContainer>
  );
}