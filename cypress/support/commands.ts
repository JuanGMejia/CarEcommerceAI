/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add('login', () => {
    cy.visit('/');
    cy.get('.mdc-button__label').contains('Login').click();
    cy.origin('https://login.microsoftonline.com', () => {
        cy.get('.logo').should('be.visible');
        cy.get('#lightbox').within($c => {
            if ($c.find('[role="listitem"]').length > 0) {
                cy.get('[role="listitem"]').eq(1).click();
            }
        });
        cy.get('[type="email"]').type(Cypress.env('EMAIL'));
        cy.get('[type="submit"]').click();
        cy.get('[name="passwd"]').type(Cypress.env('PASSWORD'));
        cy.get('[type="submit"]').click();
        cy.get('[type="submit"]').click();
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<void>
        }
    }
}

export { };
