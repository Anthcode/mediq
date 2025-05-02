import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: ${theme.typography.fontWeightMedium};
  border-radius: ${theme.borderRadius.medium};
  transition: all ${theme.transitions.short};
  cursor: pointer;
  outline: none;
  border: none;
  text-decoration: none;
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${props => {
    switch (props.size) {
      case 'small':
        return css`
          padding: ${theme.spacing(1)} ${theme.spacing(2)};
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing(2)} ${theme.spacing(4)};
          font-size: 1.125rem;
        `;
      default: // medium
        return css`
          padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
          font-size: 1rem;
        `;
    }
  }}
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrastText};
          
          &:hover {
            background-color: ${theme.colors.secondary.dark};
          }
          
          &:active {
            background-color: ${theme.colors.secondary.dark};
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};
          
          &:hover {
            background-color: rgba(30, 136, 229, 0.08);
          }
          
          &:active {
            background-color: rgba(30, 136, 229, 0.16);
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          
          &:hover {
            background-color: rgba(30, 136, 229, 0.08);
          }
          
          &:active {
            background-color: rgba(30, 136, 229, 0.16);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
          box-shadow: ${theme.shadows.small};
          
          &:hover {
            background-color: ${theme.colors.primary.dark};
            box-shadow: ${theme.shadows.medium};
          }
          
          &:active {
            background-color: ${theme.colors.primary.dark};
          }
        `;
    }
  }}
`;