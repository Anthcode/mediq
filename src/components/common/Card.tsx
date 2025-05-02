import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Card = styled.div`
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
  transition: transform ${theme.transitions.short}, box-shadow ${theme.transitions.short};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.large};
  }
`;

export const CardHeader = styled.div`
  margin-bottom: ${theme.spacing(2)};
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.text.primary};
`;

export const CardSubtitle = styled.h4`
  font-size: 1rem;
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeightMedium};
`;

export const CardContent = styled.div`
  margin-bottom: ${theme.spacing(2)};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${theme.spacing(2)};
  border-top: 1px solid ${theme.colors.neutral.light};
`;