describe('Prévisionnel App - Page de connexion - LoginView', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    it('simulate a login and check the pinia store', () => {
        // intercept real Django API call
        cy.intercept('POST', '/api/auth/token/', {
        statusCode: 200,
        body: {
            access: 'fake-access-token',
            refresh: 'fake-refresh-token',
        }
        }).as('loginRequest');

        // Fill the form
        cy.get('[data-cy=username]').type('Randomuser');
        cy.get('[data-cy=email]').type('random@gmail.com');
        cy.get('[data-cy=password]').type('@Password123456');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');
        
        // Check that the tokens are stored correctly
        cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.equal('fake-access-token');
        expect(win.localStorage.getItem('refreshToken')).to.equal('fake-refresh-token');
        });

        // Checks that the user is redirected
        cy.url().should('include', '/profil');
    });

    it('displays an error if login fails', () => {
        cy.intercept('POST', '/api/auth/token/', {
        statusCode: 401,
        body: {
            detail: 'No active account found with the given credentials'
        }
        }).as('loginFail');

        cy.get('[data-cy=username]').type('Randomuser');
        cy.get('[data-cy=email]').type('random@gmail.com');
        cy.get('[data-cy=password]').type('wrongpass');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginFail');

        cy.contains('No active account found with the given credentials').should('be.visible');
    });
})