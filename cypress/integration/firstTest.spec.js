/// <reference types="cypress" />

const { ConditionalExpr } = require("@angular/compiler")

describe('Test with backend', () => {

    beforeEach('login to the app', () => {
        // Intercepts using 'object' for method and path
        cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })
        cy.loginToApplication()
    })

    it('verify correct request and response', () => {

        cy.intercept('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is the body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            expect(xhr.response.statusCode).to.equal(307)
            expect(xhr.request.body.article.body).to.equal('This is the body of the article')
            expect(xhr.request.body.article.description).to.equal('This is a description')
        })
    })

    it('intercepting and modifying a request and response', () => {

        cy.intercept('POST', '**/articles', (req) => {
            req.body.article.description = "This is a modified description"
        }).as('postArticles')

        // Example of intercepting the response
        // cy.intercept('POST', '**/articles', (req) => {
        //     req.reply( res => {
        //         expect(res.body.article.description).to.equal("This is a modified description")
        //         req.body.article.description = "This is a modified description"
        //     })
        // }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a new title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is the body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            expect(xhr.response.statusCode).to.equal(307)
            expect(xhr.request.body.article.body).to.equal('This is the body of the article')
            expect(xhr.request.body.article.description).to.equal('This is a modified description')
        })
    })

    it('should get tags from fixture', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'rules')
    })

    it('verify global feed likes count', () => {
        cy.intercept('GET', '**/articles/feed*', { "articles": [], "articlesCount": 0 })
        cy.intercept('GET', '**/articles*', { 'fixture': 'articles.json' })

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(listOfButtons => {
            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('0')
            expect(listOfButtons[2]).to.contain('0')
        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file)
        })

        // Increase count from '0' to '1'
        cy.get('app-article-list button').eq(1).click().should('contain', '1')
    })

    it('delete a new API article using the  UI', () => {
        const userCredentials = {
            "user": {
                "email": "hsimpson@example.com",
                "password": "password"
            }
        }
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Request from API",
                "description": "API testing is easy",
                "body": "Angular is cool"
            }
        }
        cy.request('POST', Cypress.env('apiUrl') + '/api/users/login', userCredentials)
            .its('body').then(body => {
                const token = body.user.token

                cy.request({
                    url: Cypress.env('apiUrl') + '/api/articles',
                    headers: { 'Authorization': 'Token ' + token },
                    method: 'POST',
                    body: bodyRequest
                }).then(response => {
                    expect(response.status).to.equal(200)
                    console.log(response.body.article.slug)
                })

                cy.contains('Global Feed').click()
                cy.get('.article-preview').first().click()
                cy.get('.article-actions').contains('Delete Article').click()
            })
    })


    it('delete a new API article using the API', { browser: 'firefox' }, () => {
        const userCredentials = {
            "user": {
                "email": "hsimpson@example.com",
                "password": "password"
            }
        }
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Request from API",
                "description": "API testing is easy",
                "body": "Angular is cool"
            }
        }
        cy.get('@token').then(token => {

            cy.request({
                url: Cypress.env('apiUrl') + '/api/articles',
                headers: { 'Authorization': 'Token ' + token },
                method: 'POST',
                body: bodyRequest
            }).then(response1 => {
                expect(response1.status).to.equal(200)

                const articleSlug = response1.body.article.slug

                // Delete article via API
                cy.request({
                    url: Cypress.env('apiUrl') + "/api/articles/" + articleSlug,
                    headers: { 'Authorization': 'Token ' + token },
                    method: 'DELETE'
                }).then(response2 => {
                    expect(response2.status).to.equal(204)
                })

                // Check that article doesn't exist via API
                cy.request({
                    url: Cypress.env('apiUrl') + "/api/articles/" + articleSlug,
                    headers: { 'Authorization': 'Token ' + token },
                    method: 'GET'
                })
                // .then(response2 => {
                //     console.log(response2)
                //     expect(response2.body).to.have.property('author')
                // })

            })

            // Delete article via UI
            // cy.contains('Global Feed').click()
            // cy.get('.article-preview').first().click()
            // cy.get('.article-actions').contains('Delete Article').click()

            // Verify that article has been deleted (not returned as first article)
            cy.request({
                url: Cypress.env('apiUrl') + '/api/articles?limit=10&offset=0',
                headers: { 'Authorization': 'Token ' + token },
                method: 'GET'
            }).its('body').then(body => {
                console.log(body)
                expect(body.articles[0].title).not.to.equal('Request from API')
            })
        })
    })
})