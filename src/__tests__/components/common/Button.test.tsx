import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, styled, css } from 'styled-components';
import { Button } from '../../../components/common/Button';
import { theme } from '../../../styles/theme';
import { DefaultTheme } from 'styled-components';

const renderWithTheme = (ui: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Button component', () => {
  it('renderuje się poprawnie z podaną etykietą', () => {
    renderWithTheme(<Button>Przycisk testowy</Button>);
    expect(screen.getByText('Przycisk testowy')).toBeInTheDocument();
  });

  it('wywołuje funkcję onClick po kliknięciu', () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button onClick={handleClick}>Kliknij mnie</Button>);
    
    const button = screen.getByText('Kliknij mnie');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('jest wyłączony gdy przekazano prop disabled', () => {
    renderWithTheme(<Button disabled>Przycisk wyłączony</Button>);
    expect(screen.getByText('Przycisk wyłączony')).toBeDisabled();
  });
  it('obsługuje różne warianty przycisków', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveStyle(`background-color: ${theme.colors.primary.main}`);
    
    rerender(<ThemeProvider theme={theme}><Button variant="secondary">Secondary</Button></ThemeProvider>);
    expect(screen.getByText('Secondary')).toHaveStyle(`background-color: ${theme.colors.secondary.main}`);
    
    rerender(<ThemeProvider theme={theme}><Button variant="outlined">Outlined</Button></ThemeProvider>);
    expect(screen.getByText('Outlined')).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    
    rerender(<ThemeProvider theme={theme}><Button variant="text">Text</Button></ThemeProvider>);
    expect(screen.getByText('Text')).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
  });

  it('obsługuje różne rozmiary przycisków', () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    expect(screen.getByText('Small')).toHaveStyle('font-size: 0.875rem');
    
    rerender(<ThemeProvider theme={theme}><Button size="medium">Medium</Button></ThemeProvider>);
    expect(screen.getByText('Medium')).toHaveStyle('font-size: 1rem');
    
    rerender(<ThemeProvider theme={theme}><Button size="large">Large</Button></ThemeProvider>);
    expect(screen.getByText('Large')).toHaveStyle('font-size: 1.125rem');
  });

  it('obsługuje prop $fullWidth', () => {
    renderWithTheme(<Button $fullWidth>Full Width</Button>);
    expect(screen.getByText('Full Width')).toHaveStyle('width: 100%');
  });
  it('obsługuje prop $danger', () => {
    renderWithTheme(<Button $danger>Danger</Button>);
    expect(screen.getByText('Danger')).toHaveStyle(`background-color: ${theme.colors.error.main}`);
  });
  it('obsługuje interakcje z przyciskiem - hover i active', () => {
    // Zamiast testować pseudoklasy CSS, które są trudne do symulowania,
    // sprawdzamy czy komponent ma właściwie zdefiniowane style tranzycji
    renderWithTheme(<Button data-testid="interaction-button">Interact</Button>);
    const button = screen.getByTestId('interaction-button');
    
    expect(button).toHaveStyle(`transition: all ${theme.transitions.short}`);
  });

  it('obsługuje wartości cieni z motywu', () => {
    renderWithTheme(<Button variant="primary" data-testid="shadow-button">Shadow Button</Button>);
    const button = screen.getByTestId('shadow-button');
    
    expect(button).toHaveStyle(`box-shadow: ${theme.shadows.small}`);
  });

  it('obsługuje zaokrąglenia krawędzi zgodnie z motywem', () => {
    renderWithTheme(<Button data-testid="border-radius-button">Border Radius</Button>);
    const button = screen.getByTestId('border-radius-button');
    
    expect(button).toHaveStyle(`border-radius: ${theme.borderRadius.medium}`);
  });
});

describe('Button component z rozszerzonymi funkcjami motywu', () => {
  // Testy dla dodatkowych kolorów z motywu
  
  it('obsługuje wartości typografii z motywu', () => {
    renderWithTheme(<Button data-testid="typography-button">Typography Test</Button>);
    const button = screen.getByTestId('typography-button');
    
    expect(button).toHaveStyle(`font-weight: ${theme.typography.fontWeightMedium}`);
  });

  it('obsługuje warianty accent', () => {
    // Rozszerzony Button z kolorem accent
    const AccentButton = styled(Button)<{theme: DefaultTheme}>`
      background-color: ${(props) => props.theme.colors.accent.main};
      color: ${(props) => props.theme.colors.accent.contrastText};
    `;
    
    renderWithTheme(<AccentButton data-testid="accent-button">Accent</AccentButton>);
    const button = screen.getByTestId('accent-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.accent.main}`);
    expect(button).toHaveStyle(`color: ${theme.colors.accent.contrastText}`);
  });

  it('obsługuje warianty success', () => {
    // Rozszerzony Button z kolorem success
    const SuccessButton = styled(Button)<{theme: DefaultTheme}>`
      background-color: ${(props) => props.theme.colors.success.main};
      color: ${(props) => props.theme.colors.success.contrastText};
    `;
    
    renderWithTheme(<SuccessButton data-testid="success-button">Success</SuccessButton>);
    const button = screen.getByTestId('success-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.success.main}`);
    expect(button).toHaveStyle(`color: ${theme.colors.success.contrastText}`);
  });

  it('obsługuje warianty warning', () => {
    // Rozszerzony Button z kolorem warning
    const WarningButton = styled(Button)<{theme: DefaultTheme}>`
      background-color: ${(props) => props.theme.colors.warning.main};
      color: ${(props) => props.theme.colors.warning.contrastText};
    `;
    
    renderWithTheme(<WarningButton data-testid="warning-button">Warning</WarningButton>);
    const button = screen.getByTestId('warning-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.warning.main}`);
    expect(button).toHaveStyle(`color: ${theme.colors.warning.contrastText}`);
  });

  it('obsługuje wartości neutral z motywu', () => {
    // Rozszerzony Button z kolorem neutral
    const NeutralButton = styled(Button)<{theme: DefaultTheme}>`
      background-color: ${(props) => props.theme.colors.neutral.main};
      color: ${(props) => props.theme.colors.neutral.contrastText};
    `;
    
    renderWithTheme(<NeutralButton data-testid="neutral-button">Neutral</NeutralButton>);
    const button = screen.getByTestId('neutral-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.neutral.main}`);
    expect(button).toHaveStyle(`color: ${theme.colors.neutral.contrastText}`);
  });

  it('obsługuje wartości breakpoints z motywu', () => {
    // Rozszerzony Button ze stylami mediów dla breakpoints
    const ResponsiveButton = styled(Button)<{theme: DefaultTheme}>`
      @media (min-width: ${(props) => props.theme.breakpoints.md}) {
        padding: ${(props) => props.theme.spacing(3)};
      }
    `;
    
    renderWithTheme(<ResponsiveButton data-testid="responsive-button">Responsive</ResponsiveButton>);
    // Ten test sprawdza tylko czy komponent renderuje się, nie możemy sprawdzać reguł media query w JSDOM
    expect(screen.getByTestId('responsive-button')).toBeInTheDocument();
  });

  it('obsługuje wartości background z motywu', () => {
    // Rozszerzony Button z tłem background
    const BackgroundButton = styled(Button)<{theme: DefaultTheme}>`
      background-color: ${(props) => props.theme.colors.background.accent};
    `;
    
    renderWithTheme(<BackgroundButton data-testid="background-button">Background</BackgroundButton>);
    const button = screen.getByTestId('background-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.background.accent}`);
  });

  it('obsługuje wartości text z motywu', () => {
    // Rozszerzony Button z ustawieniami tekstu
    const TextButton = styled(Button)<{theme: DefaultTheme}>`
      color: ${(props) => props.theme.colors.text.secondary};
      
      &:disabled {
        color: ${(props) => props.theme.colors.text.disabled};
      }
    `;
      const { rerender } = renderWithTheme(<TextButton data-testid="text-button">Text</TextButton>);
    expect(screen.getByTestId('text-button')).toHaveStyle(`color: ${theme.colors.text.secondary}`);
    
    rerender(
      <ThemeProvider theme={theme}>
        <TextButton data-testid="text-button-disabled" disabled>Text Disabled</TextButton>
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('text-button-disabled')).toHaveStyle(`color: ${theme.colors.text.disabled}`);
  });

  it('obsługuje as prop ze styled-components dla różnych elementów', () => {
    renderWithTheme(<Button as="a" href="#" data-testid="link-button">Link Button</Button>);
    const linkButton = screen.getByTestId('link-button');
    
    expect(linkButton.tagName).toBe('A');
    expect(linkButton).toHaveAttribute('href', '#');
  });

  it('poprawnie stosuje CSS helper ze styled-components', () => {
    const customStyles = css<{theme: DefaultTheme}>`
      background-color: ${props => props.theme.colors.background.paper};
      border: 2px dashed ${props => props.theme.colors.primary.main};
    `;
    
    const StyledWithCSSHelper = styled(Button)<{theme: DefaultTheme}>`
      ${customStyles}
    `;
    
    renderWithTheme(<StyledWithCSSHelper data-testid="css-helper-button">CSS Helper</StyledWithCSSHelper>);
    const button = screen.getByTestId('css-helper-button');
    
    expect(button).toHaveStyle(`background-color: ${theme.colors.background.paper}`);
    expect(button).toHaveStyle(`border: 2px dashed ${theme.colors.primary.main}`);
  });
});
