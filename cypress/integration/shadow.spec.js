/// <reference types="cypress" />

describe('shadow dom', () => {

    // Example for specifically NOT running on firefox browser
    // The following command should cause the test to be skipped:
    //   npx cypress run --spec cypress/integration/shadow.spec.js --browser firefox
    it('access shadow dom', { browser: '!firefox' }, () => {
        cy.visit('https://radogado.github.io/shadow-dom-demo')
        cy.get('#app').shadow().find('#container')
    })
})