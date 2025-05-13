from rest_framework import serializers # A serializer is what transforms Python models to a JSON model for our API
from django.contrib.auth import get_user_model
from .models import Category, Income, Expense, Budget

# inherits from serializers.ModelSerializer
# it is directly linked to the Category model (so no needs to rewrite everything)
class CategorySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    # Meta is an internal special class where we give info to the serializer
    class Meta:
        model = Category # this serializer is for the Category model
        fields = ['id', 'name', 'type', 'user'] # which fields we want in our JSON


class IncomeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
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


# no need to create a UserSerializer. It is already taken care of by dj-rest-auth + django-allauth
# dj-rest-auth.registration already provides an /api/register/ route with a built-in serializer.
# This serializer is internally called: dj_rest_auth.registration.serializers.RegisterSerializer
# And it handles email, username, password1, and password2 (pwd confirmation), all ready to go.

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']