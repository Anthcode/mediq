import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ContainerProps {
  $maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${theme.spacing(2)};
  padding-right: ${theme.spacing(2)};
  max-width: ${props => {
    switch (props.$maxWidth) {
      case 'xs':
        return '600px';
      case 'sm':
        return '960px';
      case 'md':
        return '1280px';
      case 'lg':
        return '1440px';
      case 'xl':
        return '1920px';
      case 'full':
        return '100%';
      default:
        return '1280px';
    }
  }};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding-left: ${theme.spacing(3)};
    padding-right: ${theme.spacing(3)};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-left: ${theme.spacing(4)};
    padding-right: ${theme.spacing(4)};
  }
`;