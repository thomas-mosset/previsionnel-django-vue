# Dictionnaire de données

## Modèle : Category

| Champ   | Type Django            | Détails |
|---------|-------------------------|---------|
| id      | AutoField (clé primaire) | Généré automatiquement |
| name    | CharField (max_length=100) | Nom de la catégorie |
| type    | CharField (max_length=8, choices=[INCOME, EXPENSE]) | Type de la catégorie (Revenu ou Dépense) |
| user    | ForeignKey vers User     | Utilisateur propriétaire de la catégorie |

---

## Modèle : Income

| Champ        | Type Django                        | Détails |
|--------------|-------------------------------------|---------|
| id           | AutoField (clé primaire)            | Généré automatiquement |
| user         | ForeignKey vers User                | Utilisateur lié |
| category     | ForeignKey vers Category (INCOME)   | Catégorie liée (optionnelle, null=True) |
| amount       | DecimalField (max_digits=10, decimal_places=2) | Montant reçu |
| date         | DateField                           | Date d'entrée d'argent |
| description  | TextField (blank=True, null=True)    | Description optionnelle |

---

## Modèle : Expense

| Champ        | Type Django                        | Détails |
|--------------|-------------------------------------|---------|
| id           | AutoField (clé primaire)            | Généré automatiquement |
| user         | ForeignKey vers User                | Utilisateur lié |
| category     | ForeignKey vers Category (EXPENSE)  | Catégorie liée (optionnelle, null=True) |
| amount       | DecimalField (max_digits=10, decimal_places=2) | Montant dépensé |
| date         | DateField                           | Date de dépense |
| description  | TextField (blank=True, null=True)    | Description optionnelle |

---

## Modèle : Budget

| Champ        | Type Django                        | Détails |
|--------------|-------------------------------------|---------|
| id           | AutoField (clé primaire)            | Généré automatiquement |
| user         | ForeignKey vers User                | Utilisateur lié |
| category     | ForeignKey vers Category (EXPENSE)  | Catégorie de dépense (obligatoire) |
| amount       | DecimalField (max_digits=10, decimal_places=2) | Montant alloué |
| month        | PositiveIntegerField (choices=1-12) | Mois du budget |
| year         | PositiveIntegerField (validators=[validate_year]) | Année actuelle ou future |

---

## Notes

- `ForeignKey` avec `on_delete=models.CASCADE` : suppression en cascade si l'utilisateur est supprimé.
- `limit_choices_to` filtre les catégories selon le type ('INCOME' pour `Income`, 'EXPENSE' pour `Expense` et `Budget`).
- `validate_year` garantit que l'année du budget est égale ou supérieure à l'année en cours.
