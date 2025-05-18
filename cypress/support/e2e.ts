// Import globalnych komend Cypress dla e2e
import './commands';

// (Opcjonalnie) Obsługa nieobsłużonych wyjątków, aby testy nie przerywały się na błędach aplikacji
Cypress.on('uncaught:exception', () => {
  // Możesz dodać warunki filtrowania błędów, jeśli chcesz ignorować określone wyjątki
  return false; // zapobiega failowaniu testów na nieobsłużonych wyjątkach
});
