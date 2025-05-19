describe('Funkcjonalność autentykacji', () => {
  beforeEach(() => {
    // Przed każdym testem wyczyść cookies i local storage
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('powinna umożliwiać rejestrację nowego użytkownika', () => {
    // Wygeneruj unikalny email
    const email = `test.user.${Date.now()}@example.com`;
    const password = 'Password123!';
    
    // Przejdź do strony rejestracji
    cy.visit('/login');
    
    // Wypełnij formularz rejestracji
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="password-confirm-input"]').type(password);
    cy.get('[data-testid="signup-button"]').click();
    
    // Sprawdź, czy przekierowano na stronę potwierdzenia
    cy.url().should('include', '/verify-email');
    cy.get('[data-testid="verification-message"]').should('be.visible');
  });
  
  it('powinna umożliwiać logowanie i wylogowanie', () => {
    // Użyj istniejącego konta testowego
    const email = 'test.user@example.com';
    const password = 'Password123!';
    
    // Zaloguj się
    cy.loginByAuth(email, password);
    
    // Sprawdź, czy użytkownik jest zalogowany (np. czy widać profil)
    cy.get('[data-testid="user-profile"]').should('be.visible');
    
    // Wyloguj się
    cy.get('[data-testid="logout-button"]').click();
    
    // Sprawdź, czy użytkownik został wylogowany
    cy.get('[data-testid="login-link"]').should('be.visible');
  });
  
  it('powinna walidować dane logowania', () => {
    // Przejdź do strony logowania
    cy.visit('/login');
    
    // Wprowadź nieprawidłowe dane
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('WrongPassword123!');
    cy.get('[data-testid="login-button"]').click();
    
    // Sprawdź, czy pojawia się komunikat o błędzie
    cy.get('[data-testid="error-message"]').should('be.visible');
    
    // Sprawdź, czy nie zostaliśmy przekierowani
    cy.url().should('include', '/login');
  });
});
