

declare namespace Cypress {
  interface Chainable {
    /**
     * Loguje użytkownika przez Auth API
     * @example cy.loginByAuth('email@example.com', 'password')
     */
    loginByAuth(email: string, password: string): Chainable<Element>;
    
    /**
     * Mockuje odpowiedź OpenAI API
     * @example cy.mockOpenAIResponse()
     */
    mockOpenAIResponse(): Chainable<Element>;
    
    /**
     * Mockuje odpowiedź z API lekarzy
     * @example cy.mockDoctorsResponse()
     */
    mockDoctorsResponse(): Chainable<Element>;
    
    /**
     * Czyści localStorage przeglądarki
     * @example cy.clearLocalStorage()
     */
    clearLocalStorage(): Chainable<Element>;
    
    /**
     * Czyści ciasteczka przeglądarki
     * @example cy.clearCookies()
     */
    clearCookies(): Chainable<Element>;
  }
}
