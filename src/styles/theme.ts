export const theme = {
  colors: {
    primary: {
      main: '#1E88E5',
      light: '#64B5F6',
      dark: '#094EB9DE',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#43A047',
      light: '#76D275',
      dark: '#2E7D32',
      contrastText: '#FFFFFF'
    },
    accent: {
      main: '#E53935',
      light: '#EF5350',
      dark: '#B71C1C',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000'
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#C62828',
      contrastText: '#FFFFFF'
    },
    neutral: {
      main: '#9E9E9E',
      light: '#E0E0E0',
      dark: '#616161',
      darker: '#424242',
      contrastText: '#000000'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
      accent: '#F0F7FF'
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
      hint: '#9E9E9E'
    },
    ai: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#EC4899',
      tertiary: '#9333EA',
      light: '#F3E8FF',
      contrastText: '#FFFFFF',
      gradient: {
        primary: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)',
        secondary: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        subtle: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
      }
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  spacing: (multiplier: number = 1) => `${8 * multiplier}px`,
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    short: '0.2s ease-in-out',
    medium: '0.3s ease-in-out',
    long: '0.5s ease-in-out'
  },

  animations: {
    ai: {
      glow: 'ai-glow 2s ease-in-out infinite',
      pulse: 'ai-pulse 1.5s ease-in-out infinite',
      shimmer: 'ai-shimmer 3s ease-in-out infinite',
      brainPulse: 'ai-brain-pulse 1.5s ease-in-out infinite',
      dotWave: 'ai-dot-wave 1.5s ease-in-out infinite'
    }
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px'
  }
};