/// <reference types="cypress" />

describe('Perform API tests via Cypress', () => {

    // beforeEach('perform login', () => {
    //     cy.loginToApplication()
    // })

    it('tricks the API to return article from fixture', () => {
        cy.fixture('simpleArticle').then(file => {
            const slug = file.article.slug
            cy.intercept('GET', '**/articles/' + slug, file)
            cy.visit('/article/' + slug)
            cy.get('h1').should('contain', file.article.title)
        })
    })
})