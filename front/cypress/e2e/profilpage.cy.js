describe("Prévisionnel App - Page de profil - ProfilView - not authenticated", () => {
    it("shows a message if user is not authenticated", () => {
        cy.window().then((win) => {
            win.localStorage.clear(); // we clear to make sure there's no token
        });

        cy.visit('http://localhost:5173/profil');

        cy.contains("Vous n'êtes pas connecté").should('be.visible');
        cy.contains("Cliquez ici pour vous connecter.").should('have.attr', 'href', '/login');
    });
});

describe("Prévisionnel App - Page de profil - ProfilView - authenticated", () => {
    // log in
    beforeEach(() => {
        cy.intercept('POST', '/api/auth/token/', {
        statusCode: 200,
        body: {
            access: 'fake-access-token',
            refresh: 'fake-refresh-token',
        },
        }).as('loginRequest');

        cy.visit('http://localhost:5173/login');

        cy.get('[data-cy=username]').type('Randomuser');
        cy.get('[data-cy=email]').type('random@gmail.com');
        cy.get('[data-cy=password]').type('@Password123456');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');

        cy.url().should('include', '/profil');

        cy.window().then((win) => {
            win.localStorage.setItem('user', 'Randomuser');
            win.localStorage.setItem('userEmail', 'random@gmail.com');
        });
    });

    it('displays user info on profile page', () => {
        cy.contains('Bienvenue sur votre profil Randomuser').should('be.visible');
        cy.contains('Nom d\'utilisateur').should('be.visible');
        cy.contains('Email').should('be.visible');
    });

    it("open delete dialog and close it", () => {
        cy.contains("Supprimer mon compte").click();

        cy.contains("Êtes-vous sûr de vouloir supprimer définitivement votre compte ?").should('be.visible');

        cy.contains("Annuler").click();
        cy.contains("Êtes-vous sûr de vouloir supprimer définitivement votre compte ?").should('not.exist');
    });
});