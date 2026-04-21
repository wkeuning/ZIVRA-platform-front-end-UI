/// <reference types="cypress" />
import * as credentials from '../../fixtures/credentials.json';

describe('Session detail page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type(credentials.valid_therapist.email);
    cy.get('input[type="password"]').type(credentials.valid_therapist.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/');
  });

  it('should load and display session detail correctly after clicking "View more"', () => {
    cy.contains('Data wordt geladen...').should('not.exist');
    cy.wait(1000);

    cy.contains('View more').first().click();
    cy.wait(1000);

    cy.url().should('include', '/session/');

    cy.get('.absolute.bg-black\\/75').should('not.exist');

    cy.get('h2').should('exist');
    cy.contains('Game').should('exist');
    cy.contains('Feedback').should('exist');
  });
});
