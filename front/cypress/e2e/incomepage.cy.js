describe("Prévisionnel App - Page des revenus - IncomesView - not authenticated", () => {
        it("shows a message if user is not authenticated", () => {
        cy.window().then((win) => {
            win.localStorage.clear(); // we clear to make sure there's no token
        });

        cy.visit('http://localhost:5173/profil/incomes');

        cy.contains("Vous n'êtes pas connecté").should('be.visible');
        cy.contains("Cliquez ici pour vous connecter.").should('have.attr', 'href', '/login');
    });
});

describe('Prévisionnel App - Page des revenus - IncomesView (mocked) - authenticated - no incomes', () => {
  const mockedIncomes = [];

  const mockedCategories = [
    { id: 1, name: 'Autres', type: 'INCOME' },
    { id: 2, name: 'Salaire', type: 'INCOME' }
  ];

  beforeEach(() => {
    // 1) Intercepts mocks API
    cy.intercept('GET', '/api/incomes/', { statusCode: 200, body: mockedIncomes }).as('getIncomes');
    cy.intercept('GET', '/api/categories/', { statusCode: 200, body: mockedCategories }).as('getCategories');

    // 2) Visit neutral page to write in localStorage
    cy.visit('http://localhost:5173/login');

    // 3) Put the tokens and user in localStorage (simulate user logged in)
    cy.window().then(win => {
        win.localStorage.setItem('token', 'fake-access-token');
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.localStorage.setItem('user', 'Randomuser');
        win.localStorage.setItem('userEmail', 'random@gmail.com');

        win.authStore.initialize();

        expect(win.authStore.isAuthenticated).to.be.true;
    });

    // 4) Visit the actual page now that localStorage is ready
    cy.visit('http://localhost:5173/profil/incomes');

    // 5) Wait for intercepts to respondt
    cy.wait('@getIncomes');
    cy.wait('@getCategories');
  });

    it('displays a message when there are no incomes', () => {
        cy.contains("Vous n'avez pas encore de revenu.").should('be.visible');
    });
});

describe('Prévisionnel App - Page des revenus - IncomesView (mocked) - authenticated', () => {
  const mockedIncomes = [
    {
      id: 1,
      category: 2,
      amount: 1500,
      date: '2025-06-01',
      description: 'Salaire Juin'
    }
  ];

  const mockedCategories = [
    { id: 1, name: 'Autres', type: 'INCOME' },
    { id: 2, name: 'Salaire', type: 'INCOME' }
  ];

  beforeEach(() => {
    // 1) Intercepts mocks API
    cy.intercept('GET', '/api/incomes/', { statusCode: 200, body: mockedIncomes }).as('getIncomes');
    cy.intercept('GET', '/api/categories/', { statusCode: 200, body: mockedCategories }).as('getCategories');

    // 2) Visit neutral page to write in localStorage
    cy.visit('http://localhost:5173/login');

    // 3) Put the tokens and user in localStorage (simulate user logged in)
    cy.window().then(win => {
        win.localStorage.setItem('token', 'fake-access-token');
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.localStorage.setItem('user', 'Randomuser');
        win.localStorage.setItem('userEmail', 'random@gmail.com');

        win.authStore.initialize();

        expect(win.authStore.isAuthenticated).to.be.true;
    });

    // 4) Visit the actual page now that localStorage is ready
    cy.visit('http://localhost:5173/profil/incomes');

    // 5) Wait for intercepts to respondt
    cy.wait('@getIncomes');
    cy.wait('@getCategories');
  });

  it('displays the mocked list of income', () => {
    cy.contains('Salaire Juin');
    cy.contains('1500 €');
  });
});