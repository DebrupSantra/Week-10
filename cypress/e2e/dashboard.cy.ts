describe('Northstar dashboard demo', () => {
  it('signs in and loads dashboard metrics', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('olivia@acme.co');
    cy.get('input[type="password"]').type('demo-password');
    cy.contains('button', 'Sign in').click();
    cy.contains('Good morning, Olivia').should('be.visible');
    cy.contains('Total revenue').should('be.visible');
    cy.contains('Revenue over time').should('be.visible');
  });

  it('restricts an unauthenticated visitor from dashboard routes', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });

  it('lets an administrator filter the user directory', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@acme.co');
    cy.get('input[type="password"]').type('demo-password');
    cy.contains('button', 'Sign in').click();
    cy.contains('a', 'Users').click();
    cy.get('input[placeholder="Search users…"]').type('Phoenix');
    cy.contains('Phoenix Baker').should('be.visible');
    cy.contains('Lana Steiner').should('not.exist');
  });
});
