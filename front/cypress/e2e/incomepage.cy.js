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


  // TODO EDIT INCOME
  it('updates an income', () => {
    cy.intercept('PUT', '/api/incomes/1', (req) => {
      expect(req.body).to.include({
        category: 2,
        amount: 2500,
        date: '2025-06-17',
        description: 'Salaire Juin UPDATE'
      });

      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          ...req.body
        }
      });
    }).as('updatedIncome');

    // check if income exists
    cy.contains('Salaire Juin').should('exist');

    // trigger the edit form
    cy.get('[data-cy=income-update]').first().click();

    // fill the edit form
    cy.get('[data-cy=income-update-date]').type('2025-06-17');
    cy.get('[data-cy=income-update-description]').clear().type('Salaire Juin UPDATE');
    cy.get('[data-cy=income-update-category]').click();
    cy.get('[data-cy=income-update-amount] input').clear().type('2500');
    // Open the dropdown
    cy.get('[data-cy=income-update-category]').click();

    // Wait for the dropdown menu to render, then select the category
    cy.get('body .v-list-item-title', { timeout: 5000 })
      .contains('Salaire')
      .click();

    // submit edit form
    cy.get('[data-cy=income-save-update]').click();

    // wait for PU request to happen
    cy.wait('@updatedIncome')

    // check if newly edited income appears on screen
    cy.contains('Salaire Juin UPDATE').should('exist');
    cy.contains('2500').should('exist');
  });


  // delete an income
  it('deletes an income', () => {
    // intercept delete request
    cy.intercept('DELETE', '/api/incomes/1', { statusCode: 204 }).as('deleteIncome');

    // check if the element that we want to delete exists
    cy.contains('Salaire Juin').should('exist');

    // click on the delete btn
    cy.get('[data-cy="income-delete"]').first().click();

    // wait for DELETE request
    cy.wait('@deleteIncome');

    // check that the element is no longer here
    cy.contains('Salaire Juin').should('not.exist');
  });
});


describe('Prévisionnel App - Page des revenus - IncomesView (add an income through form) - authenticated', () => {
  const mockedIncomes = [];

  const mockedCategories = [
    { id: 1, name: 'Autres', type: 'INCOME' },
    { id: 2, name: 'Salaire', type: 'INCOME' }
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/incomes/', { statusCode: 200, body: mockedIncomes }).as('getIncomes');
    cy.intercept('GET', '/api/categories/', { statusCode: 200, body: mockedCategories }).as('getCategories');

    cy.visit('http://localhost:5173/login');

    cy.window().then(win => {
        win.localStorage.setItem('token', 'fake-access-token');
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.localStorage.setItem('user', 'Randomuser');
        win.localStorage.setItem('userEmail', 'random@gmail.com');

        win.authStore.initialize();

        expect(win.authStore.isAuthenticated).to.be.true;
    });

    cy.visit('http://localhost:5173/profil/incomes');

    cy.wait('@getIncomes');
    cy.wait('@getCategories');
  });

  it('allows the user to add an income through the form', () => {
    cy.intercept('POST', '/api/incomes', (req) => {
      expect(req.body).to.include({
        category: 2,
        amount: 2000,
        date: '2025-06-16',
        description: 'Salaire test'
      });

      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          ...req.body
        }
      });
    }).as('postIncome');

    // write into form
    cy.get('[data-cy=income-description]').type('Salaire test');

    // we use Vuetify (v-select), therefore we have to click on the v-select and then click on the category that we want in the list
    // else it won't work
    cy.get('[data-cy=income-category]').click();
    cy.get('.v-list-item-title').contains('Salaire').click(); // no [] because we target a CSS selector

    cy.get('[data-cy=income-date]').type('2025-06-16');
    cy.get('[data-cy=income-amount]').type('2000');

    // click on submit in form
    cy.get('[data-cy=income-submit]').click();

    // wait for POST request to happen
    cy.wait('@postIncome');

    // check if newly added income appears on screen
    cy.contains('Salaire test').should('exist');
    cy.contains('2000').should('exist');

    // check if the snackbar message appears on screen
    cy.contains('Revenu ajouté !').should('exist');
  });
});