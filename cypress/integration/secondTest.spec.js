/// <reference types="cypress" />

describe('Test logout', () => {
    beforeEach('login to the app', () => {
        cy.loginToApplication()
    })

    it('verify user can log out successfuly', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})