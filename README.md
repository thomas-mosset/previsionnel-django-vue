# Prévisionnel

Le projet **Prévisionnel** consiste en une application backend (pour le moment) qui permet de gérer un système de prévision financière, incluant la gestion des catégories de dépenses, des revenus et des budgets. Cette API backend permet à un frontend d'interagir via des requêtes HTTP en utilisant les standards RESTful et l'authentification basée sur JSON Web Tokens (JWT).

## Technologies utilisées

### Front

- **Vue.js** : Framework JavaScript progressif pour construire des interfaces utilisateur interactives.
- **Vuetify** : Bibliothèque de composants UI pour Vue.js.
- **Axios** : Client HTTP  utilisé pour communiquer avec l’API backend.
- **Pinia** : Gestionnaire d’état / Store de Vue 3.
- **Vue Router** : Système de routage pour Vue.js.
- **Chart.js** : Bibliothèque JavaScript de graphiques, utilisée pour afficher des données visuellement.
- **Vue ChartJS** : Intégration de Chart.js dans des composants Vue.

### Back (API)

- **Python** (v.3.12) : Version de Python utilisée pour le projet.
- **Django** : Framework backend Python pour le développement rapide d'applications web.
- **Django REST Framework (DRF)**: Bibliothèque pour la création d'API RESTful avec Django.
- **dj-rest-auth** : Extension Django pour faciliter l'authentification d'API avec des fonctionnalités comme l'inscription, la connexion et la gestion des tokens.
- **Django Allauth** : Gestion de l'authentification utilisateur, y compris la création d'un compte utilisateur, la connexion et la gestion des sessions.
- **Simple JWT** : Bibliothèque pour implémenter l'authentification JWT (JSON Web Token) dans Django REST Framework.
- **Django-environ** : Bibliothèque permettant de gérer les variables d'environnement depuis un fichier .env pour une configuration flexible de l'application.
- **Pip** : Gestionnaire de paquets Python utilisé pour l'installation des dépendances.
- **SQLite** : Base de données par défaut pour le développement local.
  
### Other

- **Postman** : Utilisé pour tester et interagir avec l'API REST, notamment pour envoyer des requêtes HTTP et vérifier les réponses.

## Fonctionnalités

- Inscription, connexion et déconnexion d'un·e utilisateur·ice via des API sécurisées avec JWT.

- Création et gestion des catégories de dépenses.

- Ajout et suivi des revenus et dépenses pour chaque utilisateur·ice.

- Création et gestion des budgets.

- Authentification JWT pour sécuriser les API.
