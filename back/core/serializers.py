from rest_framework import serializers # A serializer is what transforms Python models to a JSON model for our API
from .models import Category, Income, Expense, Budget

# inherits from serializers.ModelSerializer
# it is directly linked to the Category model (so no needs to rewrite everything)
class CategorySerializer(serializers.ModelSerializer):
    # Meta is an internal special class where we give info to the serializer
    class Meta:
        model = Category # this serializer is for the Category model
        fields = ['id', 'name', 'type', 'user'] # which fields we want in our JSON


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'user', 'category', 'amount', 'date', 'description']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'user', 'category', 'amount', 'date', 'description']


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'amount', 'month', 'year']