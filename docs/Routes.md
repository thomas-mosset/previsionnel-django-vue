# Routes de l'API

## Routes Authentification

| **Méthode** | **Route**                       | **Description**                                                                 |
|-------------|----------------------------------|---------------------------------------------------------------------------------|
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/registration/`           | Enregistrement d'un nouvel utilisateur.                                            |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/login/`              | Connexion d'un utilisateur existant. Retourne un token JWT pour l'authentification.|
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/logout/`             | Déconnexion de l'utilisateur. Expire le token JWT.                              |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/password/reset/`             | Réinitialisation du mot de passe de l'utilisateur.                         |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/password/reset/confirm/`             | Confirmation de la réinitialisation du mot de passe de l'utilisateur.                         |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/password/change/`             | Modification du mot de passe de l'utilisateur.                         |
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/auth/email/verification/`             | Vérification de l'email de l'utilisateur.                         |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/auth/token/refresh/`      | Rafraîchissement du token JWT avec un token de rafraîchissement.                |
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/auth/user/`             | Récupération des informations de l'utilisateur connecté (pk, username, email, first_name, last_name). (Route protégée par token.)                        |
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/user/current/details/`             | Récupération des informations de l'utilisateur connecté (id, username, email). (Route protégée par token.)                          |
| ![PATCH](https://img.shields.io/badge/PATCH-ffffff?style=for-the-badge&color=5928ed)     | `/api/user/current/`             | Mise à jour des informations (nom d'utilisateur et email) de l'utilisateur connecté. (Route protégée par token.)                        |
| ![DELETE](https://img.shields.io/badge/DELETE-ffffff?style=for-the-badge&color=77011b)     | `/api/user/current/delete`             | Suppression de l'utilisateur connecté. (Route protégée par token.)                        |

## Routes Ressources

### Catégories

| **Méthode** | **Route**                       | **Description**                                                                 |
|-------------|----------------------------------|---------------------------------------------------------------------------------|
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/categories/`              | Récupérer la liste de toutes les catégories.                                    |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)   | `/api/categories/`              | Créer une nouvelle catégorie.                                                   |
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/categories/{id}/`         | Récupérer les détails d'une catégorie spécifique.                               |
| ![PUT](https://img.shields.io/badge/PUT-ffffff?style=for-the-badge&color=031e98) | `/api/categories/{id}/`         | Mettre à jour une catégorie spécifique.                                         |
| ![DELETE](https://img.shields.io/badge/DELETE-ffffff?style=for-the-badge&color=77011b) | `/api/categories/{id}/`         | Supprimer une catégorie spécifique. |

### Revenus (Incomes)

| **Méthode** | **Route**                       | **Description**                                                                 |
|-------------|----------------------------------|---------------------------------------------------------------------------------|
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/incomes/`                 | Récupérer la liste de tous les revenus.                                         |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)   | `/api/incomes/`                 | Créer un nouveau revenu.                                                        |
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)     | `/api/incomes/{id}/`            | Récupérer les détails d'un revenu spécifique.                                   |
| ![PUT](https://img.shields.io/badge/PUT-ffffff?style=for-the-badge&color=031e98) | `/api/incomes/{id}/`            | Mettre à jour un revenu spécifique.                                             |
| ![DELETE](https://img.shields.io/badge/DELETE-ffffff?style=for-the-badge&color=77011b) | `/api/incomes/{id}/`            | Supprimer un revenu spécifique.|

### Dépenses (Expenses)

| **Méthode** | **Route**                       | **Description**                                                                 |
|-------------|----------------------------------|---------------------------------------------------------------------------------|
| ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)      | `/api/expenses/`                | Récupérer la liste de toutes les dépenses.                                      |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)   | `/api/expenses/`                | Créer une nouvelle dépense.                                                     |
|  ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)      | `/api/expenses/{id}/`           | Récupérer les détails d'une dépense spécifique.                                 |
| ![PUT](https://img.shields.io/badge/PUT-ffffff?style=for-the-badge&color=031e98) | `/api/expenses/{id}/`           | Mettre à jour une dépense spécifique.                                           |
| ![DELETE](https://img.shields.io/badge/DELETE-ffffff?style=for-the-badge&color=77011b) | `/api/expenses/{id}/`           | Supprimer une dépense spécifique. |

### Budgets

| **Méthode** | **Route**                       | **Description**                                                                 |
|-------------|----------------------------------|---------------------------------------------------------------------------------|
|  ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)       | `/api/budgets/`                 | Récupérer la liste de tous les budgets.                                         |
| ![POST](https://img.shields.io/badge/POST-ffffff?style=for-the-badge&color=614e26)    | `/api/budgets/`                 | Créer un nouveau budget.                                                        |
|  ![GET](https://img.shields.io/badge/GET-ffffff?style=for-the-badge&color=2b8100)      | `/api/budgets/{id}/`            | Récupérer les détails d'un budget spécifique.                                   |
| ![PUT](https://img.shields.io/badge/PUT-ffffff?style=for-the-badge&color=031e98) | `/api/budgets/{id}/`            | Mettre à jour un budget spécifique.                                             |
| ![DELETE](https://img.shields.io/badge/DELETE-ffffff?style=for-the-badge&color=77011b) | `/api/budgets/{id}/`            | Supprimer un budget spécifique. |
