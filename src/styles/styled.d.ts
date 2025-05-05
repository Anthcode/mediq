import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: {
        primary: string;
        secondary: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      success: string;
      warning: string;
      error: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}