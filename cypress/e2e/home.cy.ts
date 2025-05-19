describe('Strona główna', () => {
  beforeEach(() => {
    // Odwiedź stronę główną przed każdym testem
    cy.visit('/');
  });

  it('powinna wyświetlić tytuł aplikacji', () => {
    // Sprawdź, czy tytuł aplikacji jest widoczny
    cy.get('[data-testid="app-title"]').should('be.visible');
  });

  it('powinna zawierać panel wyszukiwania', () => {
    // Sprawdź, czy panel wyszukiwania jest widoczny
    cy.get('[data-testid="search-panel"]').should('be.visible');
  });

  it('powinna wyświetlić stopkę', () => {
    // Sprawdź, czy stopka jest widoczna
    cy.get('footer').should('be.visible');
  });
});
