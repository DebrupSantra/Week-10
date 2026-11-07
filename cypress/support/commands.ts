/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      findByLabelText(label: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('findByLabelText', (label: string) => cy.get(`[aria-label="${label}"]`));

export {};
