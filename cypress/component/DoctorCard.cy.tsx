import DoctorCard from '../../src/components/doctors/DoctorCard';

describe('DoctorCard.cy.tsx', () => {
  const mockDoctor = {
    id: 1,
    first_name: 'Jan',
    last_name: 'Kowalski',
    specialty: 'Kardiolog',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Doświadczony kardiolog z wieloletnim stażem.',
    address: {
      city: 'Warszawa',
      street: 'ul. Marszałkowska 1',
      postal_code: '00-001',
    },
    phone: '+48 123 456 789',
    email: 'jan.kowalski@example.com',
  };

  it('renderuje kartę lekarza z podstawowymi informacjami', () => {
    cy.mount(<DoctorCard doctor={mockDoctor} />);
    
    // Sprawdź, czy dane lekarza są widoczne
    cy.contains('Jan Kowalski').should('be.visible');
    cy.contains('Kardiolog').should('be.visible');
    cy.contains('Warszawa').should('be.visible');
  });
  
  it('wyświetla przycisk "Zobacz więcej"', () => {
    cy.mount(<DoctorCard doctor={mockDoctor} />);
    
    // Sprawdź, czy przycisk jest widoczny
    cy.contains('Zobacz więcej').should('be.visible');
  });
  
  it('obsługuje kliknięcie w "Zobacz więcej"', () => {
    const onClickSpy = cy.spy().as('detailSpy');
    cy.mount(<DoctorCard doctor={mockDoctor} onViewDetails={onClickSpy} />);
    
    // Kliknij przycisk i sprawdź, czy funkcja została wywołana
    cy.contains('Zobacz więcej').click();
    cy.get('@detailSpy').should('have.been.calledWith', 1); // Wywołana z ID lekarza
  });
  
  it('wyświetla avatar lekarza', () => {
    cy.mount(<DoctorCard doctor={mockDoctor} />);
    
    // Sprawdź, czy avatar jest widoczny
    cy.get('img').should('be.visible')
      .and('have.attr', 'src', 'https://example.com/avatar.jpg');
  });
  
  it('wyświetla fallback dla missing avatar', () => {
    const doctorNoAvatar = { ...mockDoctor, avatar_url: null };
    cy.mount(<DoctorCard doctor={doctorNoAvatar} />);
    
    // Sprawdź, czy avatar fallback jest widoczny
    cy.get('[data-testid="avatar-fallback"]').should('be.visible');
  });
});
