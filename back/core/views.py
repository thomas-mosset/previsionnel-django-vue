from rest_framework import viewsets, generics, permissions
from django.contrib.auth import get_user_model

from .models import Category, Income, Expense, Budget
from .serializers import CategorySerializer, IncomeSerializer, ExpenseSerializer, BudgetSerializer, UserSerializer

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

User = get_user_model()
class LoggedInUserUpdateView(generics.RetrieveUpdateAPIView):
    """ view to get and update (PATCH / PUT) the current logged in user (email + username) """
    """ a viewset is not secure, because any user could update another user's account + issue w/ the RGPD """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # function that return the current logged in user
        return self.request.user

class LoggedInUserDetailView(generics.RetrieveAPIView):
    """ view to get the current logged in user's details / infos """
    serializer_class = UserSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # function that return the current logged in user
        return self.request.user