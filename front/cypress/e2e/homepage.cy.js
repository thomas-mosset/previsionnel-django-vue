describe('Prévisionnel App - Page d\'accueil - HomeView', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('should display welcome text', () => {
    cy.contains('Bienvenue sur votre app de prévisionnel').should('be.visible');
  });

  it('should display a "Se connecter" button that redirect to login', () => {
    cy.contains('Se connecter').should('exist').click();
    cy.url().should('include', '/login');
  });

  it('should display a "Créer un compte" button that redirect to registration', () => {
    cy.visit('http://localhost:5173/'); // return to homepage after previous redirection
    cy.contains('Créer un compte').should('exist').click();
    cy.url().should('include', '/registration');
  });
});