/// <reference types="cypress" />
import * as credentials from '../../fixtures/credentials.json';

describe('Game Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should visit games page and review game', () => {
      cy.get('input[type="email"]').clear().type(credentials.valid_admin.email);
      cy.get('input[type="password"]').clear().type(credentials.valid_admin.password);
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      cy.get('a').contains('Games').click();

      cy.wait(1000);

      cy.get('button').contains('Review').click();

      cy.get('[data-cy="reviewDialog"]').should('be.visible');
  });

  it('should visit games page and review game should not be available', () => {
    cy.get('input[type="email"]').clear().type(credentials.valid_admin.email);
    cy.get('input[type="password"]').clear().type(credentials.valid_admin.password);
    cy.get('button[type="submit"]').click();
    
    cy.get('a').contains('Games').click();

    cy.wait(1000);

    cy.get('[type="checkbox"]').click();

    cy.get('button').should('not.exist');
  });

  it('should visit games page and search for a game that exists', () => {
    cy.get('input[type="email"]').clear().type(credentials.valid_admin.email);
    cy.get('input[type="password"]').clear().type(credentials.valid_admin.password);
    cy.get('button[type="submit"]').click();
    
    cy.get('a').contains('Games').click();

    cy.wait(1000);

    cy.get('[type="text"]').type('TableBall');

    cy.get('td').contains('TableBall').should('exist');
    cy.get('td').contains('Pop the balloon').should('not.exist');
  });

  it('should visit games page and search for a game that doesnt exist', () => {
    cy.get('input[type="email"]').clear().type(credentials.valid_admin.email);
    cy.get('input[type="password"]').clear().type(credentials.valid_admin.password);
    cy.get('button[type="submit"]').click();
    
    cy.get('a').contains('Games').click();

    cy.wait(1000);

    cy.get('[type="text"]').type('Not Existing Game');

    cy.get('td').contains('TableBall').should('not.exist');
    cy.get('td').contains('Pop the balloon').should('not.exist');
  });
});
