/// <reference types="cypress" />

describe('Ecommerce chat', () => {
  beforeEach(() => {
    cy.login();
  })

  it('Validate error message', () => {
    cy.intercept('/chat', {
      statusCode: 401
    }).as('chatResponse');
    cy.get('[name="message"]').type('Hola{enter}');
    cy.get('.message-bubble').as('message').should('be.visible').and('have.length', 2);
    cy.get('@message').should('contain.text', 'Tu sesión ha expirado');
  });

  it('Validate chat response', () => {
    cy.intercept('/chat', {
      statusCode: 200,
      body: {
        message: 'Vamo a ganar el reto'
      }
    }).as('chatResponse');
    cy.get('[name="message"]').type('Hola{enter}');
    cy.get('.message-bubble').as('message').should('be.visible').and('have.length', 2);
    cy.get('@message').should('contain.text', 'Vamo a ganar el reto');
  });

  it('validate user cannot send an empty request', () => {
    cy.get('[name="message"]').should('have.value', '');
    cy.get('[type="submit"]').should('be.disabled');
  });

  it('validate welcome message', () => {
    cy.get('.welcome-content').should('be.visible').within(() => {
      cy.get('h2').should('contain.text', '¡Hola! Soy Alfred');
      cy.get('p').should('contain.text', 'Tu asistente de CarEcommerce. ¿En qué puedo ayudarte hoy?');
    });
  });

  it('should show generic error on server failure', () => {
    cy.intercept('/chat', {
      statusCode: 500
    }).as('chatResponse');
    cy.get('[name="message"]').type('Hola{enter}');
    cy.get('.message-bubble').as('message').should('be.visible').and('have.length', 2);
    cy.get('@message').should('contain.text', 'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente');
  });
})
