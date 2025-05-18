import { Button } from '../../src/components/common/Button';

describe('Button.cy.tsx', () => {
  it('renderuje się poprawnie z podaną etykietą', () => {
    cy.mount(<Button>Przycisk testowy</Button>);
    cy.contains('Przycisk testowy').should('be.visible');
  });

  it('obsługuje kliknięcia', () => {
    const onClickSpy = cy.spy().as('clickSpy');
    cy.mount(<Button onClick={onClickSpy}>Kliknij mnie</Button>);
    
    cy.contains('Kliknij mnie').click();
    cy.get('@clickSpy').should('have.been.calledOnce');
  });

  it('jest wyłączony gdy przekazano prop disabled', () => {
    cy.mount(<Button disabled>Przycisk wyłączony</Button>);
    cy.contains('Przycisk wyłączony').should('be.disabled');
  });

  it('zmienia stan po najechaniu', () => {
    cy.mount(<Button>Najedź na mnie</Button>);
    
    // Sprawdź domyślny stan
    cy.contains('Najedź na mnie')
      .should('have.css', 'background-color')
      .then(initialColor => {
        // Najedź na przycisk i sprawdź, czy zmienił kolor
        cy.contains('Najedź na mnie').trigger('mouseover');
        cy.contains('Najedź na mnie')
          .should('have.css', 'background-color')
          .should(hoverColor => {
            // Sprawdź, czy kolor się zmienił
            expect(hoverColor).not.to.eq(initialColor);
          });
      });
  });
});
