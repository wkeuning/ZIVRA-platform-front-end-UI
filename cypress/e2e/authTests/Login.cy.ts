/// <reference types="cypress" />
import * as credentials from '../../fixtures/credentials.json';

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type(credentials.valid_therapist.email);
    cy.get('input[type="password"]').type(credentials.valid_therapist.password);
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('should show error message with invalid credentials', () => {
    cy.get('input[type="email"]').type(credentials.invalid.email);
    cy.get('input[type="password"]').type(credentials.invalid.password);
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should navigate to profile page and log out', () => {
    cy.get('input[type="email"]').type(credentials.valid_therapist.email);
    cy.get('input[type="password"]').type(credentials.valid_therapist.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:5173/');
    
    cy.get('a[href="/profile"]').click();
    cy.url().should('eq', 'http://localhost:5173/profile');
    
    cy.get('button').contains('Logout').click();
    cy.url().should('eq', 'http://localhost:5173/login');
  });

  it('should show error for invalid email format', () => {
      cy.get('input[type="email"]').clear().type(credentials.invalid_email.email);
      cy.get('input[type="password"]').clear().type(credentials.invalid_email.password);

      cy.get('button[type="submit"]').click();
      
      cy.contains('Invalid email format').should('be.visible');

      cy.url().should('eq', 'http://localhost:5173/login');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    cy.clearLocalStorage();
    
    cy.visit('http://localhost:5173/profile');
    cy.url().should('eq', 'http://localhost:5173/login');
    
    cy.visit('http://localhost:5173/');
    cy.url().should('eq', 'http://localhost:5173/login');
  });

  it('should maintain session after page refresh', () => {
    cy.get('input[type="email"]').type(credentials.valid_therapist.email);
    cy.get('input[type="password"]').type(credentials.valid_therapist.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:5173/');
    
    cy.reload();
    
    cy.url().should('eq', 'http://localhost:5173/');
    cy.get('a[href="/profile"]').should('be.visible');
    
    cy.window().its('localStorage.token').should('exist');
  });
});
