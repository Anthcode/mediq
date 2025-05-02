import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps {
  $error?: boolean;
  $fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
  font-size: 1rem;
  border: 1px solid ${props => props.$error ? theme.colors.error.main : theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.background.default};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.short};
  outline: none;
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  &:focus {
    border-color: ${props => props.$error ? theme.colors.error.main : theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.$error 
      ? `${theme.colors.error.light}40` 
      : `${theme.colors.primary.light}40`};
  }
  
  &:hover {
    border-color: ${props => props.$error ? theme.colors.error.main : theme.colors.text.primary};
  }
  
  &::placeholder {
    color: ${theme.colors.text.hint};
  }
  
  &:disabled {
    background-color: ${theme.colors.neutral.light};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeightMedium};
  font-size: 0.875rem;
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing(3)};
`;

export const InputError = styled.span`
  display: block;
  color: ${theme.colors.error.main};
  font-size: 0.75rem;
  margin-top: ${theme.spacing(0.5)};
`;