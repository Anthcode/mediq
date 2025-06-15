import React from 'react';
import styled, { keyframes } from 'styled-components';

const brainPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.1);
    opacity: 1;
  }
`;

const dotAnimation = keyframes`
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
`;

const BrainIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: ${brainPulse} 1.5s ease-in-out infinite;
  
  &::after {
    content: '✨';
  }
`;

const LoadingText = styled.div`
  color: #6B46C1;
  font-weight: 600;
  font-size: 1rem;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 6px;
  height: 6px;
  background: #8B5CF6;
  border-radius: 50%;
  animation: ${dotAnimation} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

interface AILoadingIndicatorProps {
  message?: string;
}

export const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({
  message = 'AI analizuje Twoje objawy...'
}) => {
  return (
    <LoadingContainer>
      <BrainIcon />
      <LoadingText>{message}</LoadingText>
      <DotsContainer>
        <Dot $delay={0} />
        <Dot $delay={0.2} />
        <Dot $delay={0.4} />
      </DotsContainer>
    </LoadingContainer>
  );
};