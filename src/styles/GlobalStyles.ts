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
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
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
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: ${theme.colors.primary.light};
    color: ${theme.colors.primary.contrastText};
  }
`;