describe('MedIQ - Główny przepływ użytkownika', () => {
  beforeEach(() => {
    // Czyszczenie stanu przed każdym testem
    cy.clearLocalStorage();
    cy.clearCookies();
    // Ignoruj błędy cross-origin stylesheet
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('cssRules getter')) {
        return false;
      }
    });
  });

  it('Użytkownik powinien móc zalogować się, wyszukać lekarzy i zobaczyć szczegóły', () => {
    // 1. Przygotowanie mockowania API
    cy.mockOpenAIResponse();
    cy.mockDoctorsResponse();
    
    // 2. Logowanie użytkownika
    const testEmail = Cypress.env('testUserEmail');
    const testPassword = Cypress.env('testUserPassword');
    cy.visit('/login');
    cy.get('input[name="email"]').should('be.visible').type(testEmail);
    cy.get('input[name="password"]').should('be.visible').type(testPassword);
    cy.get('button[type="submit"]').click();
    
    // 3. Weryfikacja, że użytkownik jest zalogowany
    cy.get('nav button:contains("Wyloguj się")').should('be.visible');
    
    // 4. Wyszukiwanie lekarzy na podstawie objawów
    cy.get('input[placeholder*="Opisz swoje objawy"]').should('be.visible').type('Mam silne bóle głowy, zawroty i nudności od tygodnia');
    cy.get('button:contains("Szukaj lekarza")').click();
    
    // 5. Oczekiwanie na zakończenie analizy AI i pobranie lekarzy
    cy.wait('@openaiRequest');
    cy.wait('@doctorsRequest');
    
    // 6. Weryfikacja wyników analizy AI
    cy.get('div:contains("Analiza sztucznej inteligencji")').should('be.visible');
    cy.get('div:contains("Rozpoznane objawy")').should('be.visible');
    cy.get('li:contains("ból głowy")').should('be.visible');
    
    // 7. Weryfikacja listy rekomendowanych lekarzy
    cy.get('div:contains("Znaleziono")').should('be.visible');
    cy.get('div:contains("Anna Nowak")').should('be.visible');
    cy.get('div:contains("Neurolog")').should('be.visible');
    
    // 8. Wejście w szczegóły wybranego lekarza
    cy.get('a:contains("Zobacz profil")').first().click();
    
    // 9. Weryfikacja strony szczegółów lekarza
    cy.url().should('include', '/doctors/');
    cy.get('h1:contains("Anna Nowak")').should('be.visible');
    cy.get('div:contains("O lekarzu")').should('be.visible');
    cy.get('div:contains("Specjalistka w diagnozowaniu i leczeniu chorób układu nerwowego")').should('be.visible');
    
    // 10. Powrót do strony głównej
    cy.get('button:contains("Wróć")').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // 11. Wylogowanie użytkownika
    cy.get('button:contains("Wyloguj się")').click();
    cy.get('a:contains("Zaloguj się")').should('be.visible');
  });
});