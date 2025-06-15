import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      accent: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      success: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      warning: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      neutral: {
        main: string;
        light: string;
        dark: string;
        darker: string;
        contrastText: string;
      };
      background: {
        default: string;
        paper: string;
        accent: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
        hint: string;
      };
      ai: {
        primary: string;
        secondary: string;
        accent: string;
        tertiary: string;
        light: string;
        contrastText: string;
        gradient: {
          primary: string;
          secondary: string;
          subtle: string;
        };
      };
    };
    typography: {
      fontFamily: string;
      fontSize: number;
      fontWeightLight: number;
      fontWeightRegular: number;
      fontWeightMedium: number;
      fontWeightBold: number;
    };
    spacing: (multiplier?: number) => string;
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      round: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    transitions: {
      short: string;
      medium: string;
      long: string;
    };
     animations: {
      ai: {
        glow: string;
        pulse: string;
        shimmer: string;
        brainPulse: string;
        dotWave: string;
      };
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
}