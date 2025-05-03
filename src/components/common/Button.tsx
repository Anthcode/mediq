import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  disabled?: boolean;
  $danger?: boolean;
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
    const color = props.$danger ? theme.colors.error : theme.colors.primary;

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
          color: ${color.main};
          border: 1px solid ${color.main};
          
          &:hover {
            background-color: ${color.light};
          }
          
          &:active {
            background-color: ${color.dark};
            color: ${color.contrastText};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${color.main};
          
          &:hover {
            background-color: ${color.light};
          }
          
          &:active {
            background-color: ${color.dark};
            color: ${color.contrastText};
          }
        `;
      default: // primary
        return css`
          background-color: ${color.main};
          color: ${color.contrastText};
          box-shadow: ${theme.shadows.small};
          
          &:hover {
            background-color: ${color.dark};
            box-shadow: ${theme.shadows.medium};
          }
          
          &:active {
            background-color: ${color.dark};
          }
        `;
    }
  }}
`;