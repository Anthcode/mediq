import './commands';

// Import global styles
import '../../src/index.css';

import { mount, MountOptions, MountReturn } from 'cypress/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '../../src/styles/theme';
import { GlobalStyles } from '../../src/styles/GlobalStyles'; // Corrected import name

// Extend Cypress types using module augmentation

// Add mount command type to Cypress namespace {
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React component with ThemeProvider and MemoryRouter
       * @param component - The React component to mount
       * @param options - Additional mount options
       */
      mount(component: React.ReactNode, options?: MountOptions): Cypress.Chainable<MountReturn>;
    }
  }
}
// }

// Konfiguracja globalnego mounta dla komponentów React
// z opakowaniem w ThemeProvider, MemoryRouter i GlobalStyle
Cypress.Commands.add('mount', (component: React.ReactNode, options = {}) => {
  const wrappedComponent = (
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {component}
      </ThemeProvider>
    </MemoryRouter>
  );

  return mount(wrappedComponent, options);
});