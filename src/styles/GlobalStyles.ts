import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize}px;
    background-color: ${theme.colors.background.default};
    color: ${theme.colors.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing(2)};
    line-height: 1.2;
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeightBold};
  }

  h1 {
    font-size: 1rem;
  }

  h2 {
    font-size: 0.875rem;
  }

  h3 {
    font-size: 0.75rem;
  }

  h4 {
    font-size: 0.625rem;
  }

  h5 {
    font-size: 0.5rem;
  }

  h6 {
    font-size: 0.375rem;
  }

  p {
    margin-bottom: ${theme.spacing(2)};
    line-height: 1.5;
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    transition: color ${theme.transitions.short};

    &:hover {
      color: ${theme.colors.primary.dark};
      text-decoration: underline;
    }
  }

  button {
    font-family: ${theme.typography.fontFamily};

    &:hover {
      color: inherit;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* AI Animations */
  @keyframes ai-glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
    }
    50% { 
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
    }
  }

  @keyframes ai-pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 0.8;
    }
    50% { 
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes ai-shimmer {
    0% { 
      transform: translateX(-100%); 
    }
    100% { 
      transform: translateX(100%); 
    }
  }

  @keyframes ai-brain-pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 0.8;
    }
    50% { 
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes ai-dot-wave {
    0%, 20% { 
      opacity: 0; 
    }
    50% { 
      opacity: 1; 
    }
    100% { 
      opacity: 0; 
    }
  }

  ::selection {
    background-color: ${theme.colors.primary.light};
    color: ${theme.colors.primary.contrastText};
  }
`;