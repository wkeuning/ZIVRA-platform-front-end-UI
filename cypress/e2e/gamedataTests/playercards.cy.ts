/// <reference types="cypress" />
import * as credentials from '../../fixtures/credentials.json';

describe('PlayerCard rendering test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type(credentials.valid_therapist.email);
    cy.get('input[type="password"]').type(credentials.valid_therapist.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/');

    cy.visit('http://localhost:5173/');
  });

  it('should render player cards when data is fetched', () => {
    cy.contains('Data wordt geladen...').should('not.exist');
    cy.wait(1000);


    cy.get('.player-card').should('have.length.greaterThan', 0);

    cy.contains('Lorem ipsum').should('exist');
    cy.contains('Game').should('exist');
  });
});
