from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, IncomeViewSet, ExpenseViewSet, BudgetViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet) # -> 'http://localhost:8000/api/categories/'
router.register(r'incomes', IncomeViewSet) # -> '/api/incomes/'
router.register(r'expenses', ExpenseViewSet) # -> '/api/expenses/'
router.register(r'budgets', BudgetViewSet) # -> '/api/budgets/'

# '/api/register/' ONLY FOR POST ROUTE (no need to write it, it's taken care of by dj-rest-auth + django-allauth)

urlpatterns = [
    path('', include(router.urls)),
]