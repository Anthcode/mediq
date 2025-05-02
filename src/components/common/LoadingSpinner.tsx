import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  $fullpage?: boolean;
}

export const Spinner = styled.div<SpinnerProps>`
  display: inline-block;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.color || theme.colors.primary.main};
  animation: ${spin} 1s ease-in-out infinite;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          width: 16px;
          height: 16px;
        `;
      case 'large':
        return `
          width: 48px;
          height: 48px;
        `;
      default: // medium
        return `
          width: 24px;
          height: 24px;
        `;
    }
  }}
`;

interface LoadingContainerProps {
  $fullpage?: boolean;
}

export const LoadingContainer = styled.div<LoadingContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  ${props => props.$fullpage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  `}
`;

export const LoadingText = styled.p`
  margin-top: ${theme.spacing(2)};
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
`;

export const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'medium', $fullpage = false }) => {
  return (
    <LoadingContainer $fullpage={$fullpage}>
      <Spinner size={size} />
      <LoadingText>Ładowanie...</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;