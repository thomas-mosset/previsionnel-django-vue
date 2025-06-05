describe('Prévisionnel App - Page d\'inscription - RegistrationView', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/registration');
    });

    it('simulate a sign in and check the pinia store', () => {
        // intercept registration call
        cy.intercept('POST', '/api/auth/registration/', {
            statusCode: 201, // successful request
        }).as('registerRequest');

        // intercept token request right after registration
        cy.intercept('POST', '/api/auth/token/', {
            statusCode: 200,
            body: {
                access: 'fake-access-token',
                refresh: 'fake-refresh-token',
            }
        }).as('tokenRequest');

        // Fill the form
        cy.get('[data-cy=username]').type('NewUser');
        cy.get('[data-cy=email]').type('newuser@example.com');
        cy.get('[data-cy=password]').type('@Password123');
        cy.get('[data-cy=passwordConfirmation]').type('@Password123');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerRequest');
        cy.wait('@tokenRequest');
        
        // Check that the tokens are stored correctly
        cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.equal('fake-access-token');
        expect(win.localStorage.getItem('refreshToken')).to.equal('fake-refresh-token');
        });

        // Checks that the user is redirected
        cy.url().should('include', '/profil');
    });

    // sign in errors tests
    it('shows an error if the password is too short', () => {
        cy.intercept('POST', '/api/auth/registration', {
            statusCode: 400,
            body: {
                password1: ["This password is too short. It must contain at least 8 characters."],
            },
        }).as('registerFail');

        cy.get('[data-cy=username]').type('NewUser');
        cy.get('[data-cy=email]').type('newuser@example.com');
        cy.get('[data-cy=password]').type('pwd'); // short password - here test with a 3 chars password "pwd"
        cy.get('[data-cy=passwordConfirmation]').type('pwd');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerFail');

        cy.contains('Ce mot de passe est trop court. Il doit contenir au moins 8 caractères.').should('be.visible');
    });

    it('shows an error if the passwords don\'t match', () => {
        cy.intercept('POST', '/api/auth/registration', {
            statusCode: 400,
            body: {
                password1: ["The two password fields didn't match."],
            },
        }).as('registerFail');

        cy.get('[data-cy=username]').type('NewUser');
        cy.get('[data-cy=email]').type('newuser@example.com');
        cy.get('[data-cy=password]').type('Password123');
        cy.get('[data-cy=passwordConfirmation]').type('DifferentPassword123');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerFail');

        cy.contains('Les deux mots de passe ne correspondent pas.').should('be.visible');
    });

    it('shows an error if the username address already exists in the database', () => {
        cy.intercept('POST', '/api/auth/registration', {
            statusCode: 400,
            body: {
                username: ["A user with that username already exists."],
            },
        }).as('registerFail');

        cy.get('[data-cy=username]').type('Randomuser');
        cy.get('[data-cy=email]').type('random@gmail.com');
        cy.get('[data-cy=password]').type('Password123');
        cy.get('[data-cy=passwordConfirmation]').type('Password123');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerFail');

        cy.contains('Un utilisateur avec ce nom existe déjà.').should('be.visible');
    });

    it('shows an error if the email address is invalid', () => {
        cy.intercept('POST', '/api/auth/registration', {
            statusCode: 400,
            body: {
                email: ["Enter a valid email address."],
            },
        }).as('registerFail');

        cy.get('[data-cy=username]').type('Randomuser');
        cy.get('[data-cy=email]').type('random-gmail.com'); // no @
        cy.get('[data-cy=password]').type('Password123');
        cy.get('[data-cy=passwordConfirmation]').type('Password123');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerFail');

        cy.contains('Entrez une adresse e-mail valide.').should('be.visible');
    });
})