from rest_framework import viewsets
from .models import Category, Income, Expense, Budget
from .serializers import CategorySerializer, IncomeSerializer, ExpenseSerializer, BudgetSerializer

# each class will manage all actions (GET, POST, PUT, DELETE)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all() # will need to work with all existing categories
    serializer_class = CategorySerializer # which serializer to use to convert python object into JSON


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
