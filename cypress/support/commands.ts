// cypress/support/commands.ts

Cypress.Commands.add('loginByAuth', (email: string, password: string) => {
  cy.log('Logowanie przez Auth');
  // Interceptowanie zapytania Auth
  cy.intercept('POST', '**/auth/v1/token*').as('loginRequest');
  
  // Przejście do strony logowania
  cy.visit('/login');
  
  // Wypełnienie formularza logowania
  cy.get('input[name="email"]').should('be.visible').type(email);
  cy.get('input[name="password"]').should('be.visible').type(password, { log: false });
  cy.get('button[type="submit"]').click();
  
  // Oczekiwanie na zakończenie zapytania logowania
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  
  // Weryfikacja przekierowania na stronę główną
  cy.url().should('include', '/');
});

// Interceptowanie OpenAI API dla testów
Cypress.Commands.add('mockOpenAIResponse', () => {
  cy.intercept('POST', '**/chat/completions', {
    statusCode: 200,
    body: {
      choices: [
        {
          message: {
            content: JSON.stringify({
              symptoms: ['ból głowy', 'zawroty głowy', 'nudności'],
              specialtyMatches: [
                {
                  name: 'Neurolog',
                  matchPercentage: 90,
                  reasoning: 'Objawy wskazują na problemy neurologiczne'
                },
                {
                  name: 'Okulista',
                  matchPercentage: 75,
                  reasoning: 'Ból głowy może być związany z problemami wzroku'
                }
              ]
            })
          }
        }
      ]
    }
  }).as('openaiRequest');
});

// Mockowanie odpowiedzi z Supabase dla lekarzy
Cypress.Commands.add('mockDoctorsResponse', () => {
  cy.intercept('GET', '**/rest/v1/doctors*', (req) => {
    // Sprawdź czy zapytanie jest po id (szczegóły) czy listę
    const url = req.url;
    if (url.includes('id=eq.2')) {
      req.reply({
        statusCode: 200,
        body: {
          id: '2',
          first_name: 'Anna',
          last_name: 'Nowak',
          specialties: 'Neurolog',
          experience: 12,
          education: 'Uniwersytet Jagielloński',
          bio: 'Specjalistka w diagnozowaniu i leczeniu chorób układu nerwowego.',
          profile_image_url: 'https://example.com/avatar2.jpg',
          active: true,
          addresses: [
            {
              id: '2',
              street: 'ul. Floriańska 2',
              city: 'Kraków',
              state: null,
              postal_code: '30-001',
              country: null
            }
          ],
          ratings: []
        }
      });
    } else {
      req.reply({
        statusCode: 200,
        body: [
          {
            id: '2',
            first_name: 'Anna',
            last_name: 'Nowak',
            specialties: 'Neurolog',
            experience: 12,
            education: 'Uniwersytet Jagielloński',
            bio: 'Specjalistka w diagnozowaniu i leczeniu chorób układu nerwowego.',
            profile_image_url: 'https://example.com/avatar2.jpg',
            active: true,
            addresses: [
              {
                id: '2',
                street: 'ul. Floriańska 2',
                city: 'Kraków',
                state: null,
                postal_code: '30-001',
                country: null
              }
            ],
            ratings: []
          }
        ]
      });
    }
  }).as('doctorsRequest');
});