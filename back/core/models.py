from django.db import models
from django.contrib.auth import get_user_model # Django has an already pre-made User model
from django.core.exceptions import ValidationError
from django.utils import timezone

User = get_user_model() # we get the already made user model here

class Category(models.Model):
    ''' Define 2 types of categories : Income and Expense '''
    INCOME = 'INCOME'
    EXPENSE = 'EXPENSE'

    CATEGORY_TYPES = [
        (INCOME, 'Revenu'),
        (EXPENSE, 'Dépense'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=8, choices=CATEGORY_TYPES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    # each category belongs to a specific User (so they - the users -  all have their own categories)

    # def __str__(self): make model objects more readable in the Django admin and when displaying them in templates
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class Income(models.Model):
    ''' Define a model for the money entries '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes') # the user getting the money (on_delete=models.CASCADE -> if the user is deleted, then all of their income and expense are as well)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, limit_choices_to={'type': 'INCOME'}) # optional, related to a Category of type INCOME
    amount = models.DecimalField(max_digits=10, decimal_places=2) # amount (max_digits=10 -> total nb of numbers before + after the coma -- ex : 99 999 999.99) | (decimal_places=2 -> for the cents)
    date = models.DateField() # when money is in
    description = models.TextField(blank=True, null=True) # optional (to give a title, comment, etc)

    def __str__(self):
        return f"{self.amount}€ - {self.date} - {self.category}"


class Expense(models.Model):
    ''' Define a model for the money expenses '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, limit_choices_to={'type': 'EXPENSE'})
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.amount}€ - {self.date} - {self.category}"

def validate_year(value):
    current_year = timezone.now().year
    if value < current_year:
        raise ValidationError(f"L'année doit être {current_year} ou plus tard.")
    
class Budget(models.Model):
    ''' Define a model for the money budget '''
    MONTHS = [
        (1, "Janvier"),
        (2, "Février"),
        (3, "Mars"),
        (4, "Avril"),
        (5, "Mai"),
        (6, "Juin"),
        (7, "Juillet"),
        (8, "Août"),
        (9, "Septembre"),
        (10, "Octobre"),
        (11, "Novembre"),
        (12, "Décembre"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, limit_choices_to={'type': 'EXPENSE'})
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.PositiveIntegerField(choices=MONTHS) # restrict to 12 months thanks to our array
    year = models.PositiveIntegerField(
        validators=[validate_year]
    )

    def __str__(self):
        return f"Budget {self.amount}€ pour {self.category.name} - {self.month}/{self.year}"