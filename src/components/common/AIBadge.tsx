import React from 'react';
import styled, { css } from 'styled-components';


interface AIBadgeProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  label?: string;
}

const BadgeContainer = styled.div<{ $variant: string; $size: string; $animated: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '4px 8px';
      case 'large': return '8px 16px';
      default: return '6px 12px';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.large};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.75rem';
      case 'large': return '1rem';
      default: return '0.875rem';
    }
  }};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.transitions.short};
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.ai.gradient.primary};
          color: ${props.theme.colors.ai.contrastText};
          ${props.$animated && css`animation: ${props.theme.animations.ai.glow};`}
        `;
      case 'secondary':
        return css`
          background: ${props.theme.colors.ai.light};
          color: ${props.theme.colors.ai.primary};
          border: 1px solid ${props.theme.colors.ai.secondary}33;
        `;
      default:
        return css`
          background: ${props.theme.colors.ai.gradient.subtle};
          color: ${props.theme.colors.ai.primary};
          border: 1px solid ${props.theme.colors.ai.primary}1A;
        `;
    }
  }}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    ${props => props.$animated && css`
      animation: ${props.theme.animations.ai.shimmer};
    `}
  }
`;

const AIIcon = styled.div<{ $size: string; $animated: boolean }>`
  width: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.round};
  background: radial-gradient(circle, #FBBF24 0%, #F59E0B 70%);
  position: relative;
  z-index: 1;
  
  ${props => props.$animated && css`
    animation: ${props.theme.animations.ai.pulse};
  `}

  &::after {
    content: '✨';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${props => {
      switch (props.$size) {
        case 'small': return '8px';
        case 'large': return '12px';
        default: return '10px';
      }
    }};
  }
`;

const Label = styled.span`
  position: relative;
  z-index: 1;
`;

export const AIBadge: React.FC<AIBadgeProps> = ({
  variant = 'minimal',
  size = 'medium',
  animated = false,
  label = 'AI'
}) => {
  return (
    <BadgeContainer $variant={variant} $size={size} $animated={animated}>
      <AIIcon $size={size} $animated={animated} />
      <Label>{label}</Label>
    </BadgeContainer>
  );
};