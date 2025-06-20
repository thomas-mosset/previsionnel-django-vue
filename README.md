# Prévisionnel

Le projet **Prévisionnel** consiste en une application web qui permet de gérer un système de prévision financière, incluant la gestion des catégories, des dépenses, des revenus et des budgets. L'API backend permet au frontend d'interagir via des requêtes HTTP en utilisant les standards RESTful et l'authentification basée sur JSON Web Tokens (JWT).

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
- **SQLite** : Base de données pour mon développement en local.

### Tests

- **Cypress** : Utilisé pour tester le fonctionnement de l'application (e2e) en simulant un comportement utilisateur dans le navigateur. (Exemple : inscription, connexion et accès à son profil, ajout, édition et suppression d'un revenu.)
- **APITestCase (fourni par Django REST Framework)** : Utilisé pour tester les endpoints de l’API backend. Ces tests d'intégration vérifient que les opérations CRUD (création, lecture, mise à jour, suppression) fonctionnent correctement en simulant des requêtes HTTP authentifiées.

### Other

- **Postman** : Utilisé pour tester et interagir avec l'API REST, notamment pour envoyer des requêtes HTTP et vérifier les réponses.

## Fonctionnalités

- Inscription, connexion, déconnexion et suppression d'un·e utilisateur·ice via des API sécurisées avec JWT.

- Modification du mot de passe d'un·e utilisateur·ice connecté·e.

- Création et gestion (modification et suppression) des catégories de dépenses.

- Création et gestion (modification et suppression) des revenus et dépenses.

- Création et gestion (modification et suppression) des budgets.

- Authentification JWT pour sécuriser l'API.

## Démo

[![Démo de l'application](https://markdown-videos-api.jorgenkh.no/youtube/pS-tHBDF72A)](https://youtu.be/pS-tHBDF72A)

## Installation et lancement de l'application

⚠️ Prérequis

- Python 3.12+
- VueJs 3
- pip
- Une base de données SQLite
- npm

### Étapes d'installation

1. Clonez le *repository*.

```sh
git clone [LIEN](https://github.com/thomas-mosset/previsionnel-django-vue) 
cd previsionnel-django-vue
```

2. Rendez-vous dans le dossier ```back```...

```sh
cd back
````

... Et installez les dépendances / paquets nécessaires pour le backend :
  
```sh
pip install -r requirements.txt
````

3. Créez et configurez un fichier ```.env``` à la racine du dossier ```back``` et définissez les variables suivantes :

````ini
SECRET_KEY=votre_cle_secrète
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=db.sqlite3
````

4. Effectuez les migrations de la base de données.

```sh
python manage.py migrate
```

5. Créez un super utilisateur (optionnel pour l'admin + refaire une migration en cas de création d’un super utilisateur).

```sh
python manage.py createsuperuser
python manage.py migrate
```

6. Démarrez le serveur back. (L'API sera disponible à <http://127.0.0.1:8000/>. Les différentes routes sont listées dans le dossier ```docs``` à la racine du projet.)

```sh
python manage.py runserver
```

7. Ouvrez un nouveau terminal et rendez-vous dans le dossier ```front``` du projet.

```sh
cd front
```

8. Installez les dépendances / paquets nécessaires pour le frontend :

```sh
npm install
```

9.  Démarrez le serveur front. (L'app sera disponible à <http://localhost:5173/>.)

```sh
npm run dev
```
