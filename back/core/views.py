from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from django.contrib.auth import get_user_model

from .models import Category, Income, Expense, Budget
from .serializers import CategorySerializer, IncomeSerializer, ExpenseSerializer, BudgetSerializer, UserSerializer

# each class will manage all actions (GET, POST, PUT, DELETE)

class CategoryViewSet(viewsets.ModelViewSet):
    # queryset = Category.objects.all() # any logged in user can access all categories
    queryset = Category.objects.none()
    serializer_class = CategorySerializer # which serializer to use to convert python object into JSON
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user) # to get only the categories related to the logged in user

    # when creating a new cat, we won't need to add the user, it will be automatically be done by django w/ this function
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # function that return the current logged in user
        return self.request.user

class LoggedInUserDeleteView(generics.DestroyAPIView):
    """ view to delete the current logged in user """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # function that return the current logged in user
        return self.request.user
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        # Blacklist all user's tokens
        tokens = OutstandingToken.objects.filter(user=user) # OutstandingToken = all valid tokens

        for token in tokens:
            try: 
                BlacklistedToken.objects.get_or_create(token=token) # BlacklistedToken = non usable tokens
            except Exception:
                pass # ignore if already blacklisted
        
        # delete user
        user.delete()

        return Response(
            {"detail": "Compte supprimé et tokens JWT invalidés."},
            status=status.HTTP_204_NO_CONTENT
        )