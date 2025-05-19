describe('Funkcjonalność wyszukiwania', () => {
  beforeEach(() => {
    // Odwiedź stronę główną przed każdym testem
    cy.visit('/');
    
    // Poczekaj aż panel wyszukiwania będzie gotowy
    cy.get('[data-testid="search-panel"]').should('be.visible');
  });

  it('powinna umożliwiać wyszukiwanie lekarzy', () => {
    const searchTerm = 'kardiolog';
    
    // Wprowadź zapytanie wyszukiwania
    cy.searchDoctors(searchTerm);
    
    // Sprawdź, czy wyniki wyszukiwania są wyświetlane
    cy.get('[data-testid="search-results"]').should('be.visible');
    
    // Sprawdź, czy wyniki zawierają szukany termin
    cy.get('[data-testid="doctor-card"]').should('exist');
    
    // Sprawdź, czy historia wyszukiwania została zaktualizowana
    cy.get('[data-testid="search-history"]').should('contain', searchTerm);
  });
  
  it('powinna obsłużyć brak wyników wyszukiwania', () => {
    const searchTerm = 'nieistniejąca specjalizacja 12345';
    
    // Wprowadź zapytanie wyszukiwania
    cy.searchDoctors(searchTerm);
    
    // Sprawdź, czy komunikat o braku wyników jest wyświetlany
    cy.get('[data-testid="no-results"]').should('be.visible');
  });
  
  it('powinna umożliwiać filtrowanie wyników wyszukiwania', () => {
    const searchTerm = 'lekarz';
    
    // Wprowadź zapytanie wyszukiwania
    cy.searchDoctors(searchTerm);
    
    // Sprawdź, czy filtry są dostępne
    cy.get('[data-testid="filters-panel"]').should('be.visible');
    
    // Wybierz filtr specjalizacji
    cy.get('[data-testid="specialty-filter"]').click();
    cy.get('[data-testid="specialty-option"]').first().click();
    
    // Sprawdź, czy wyniki zostały przefiltrowane
    cy.get('[data-testid="search-results"]').should('be.visible');
    cy.get('[data-testid="doctor-card"]').should('have.length.lessThan', 10);
  });
});
