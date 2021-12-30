/// <reference types="cypress" />


describe('visual test', () => {

    it('should test snapshot', () => {
        cy.visit('/')

        cy.contains('Gerome').then(authorName => {
            cy.wrap(authorName).toMatchImageSnapshot()
            // To take snapshot of entire document
            cy.document().toMatchImageSnapshot()
        })
    })
})