from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CategoryViewSet, IncomeViewSet, ExpenseViewSet, BudgetViewSet, LoggedInUserUpdateView, LoggedInUserDetailView, LoggedInUserDeleteView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet) # -> 'http://localhost:8000/api/categories/'
router.register(r'incomes', IncomeViewSet) # -> '/api/incomes/'
router.register(r'expenses', ExpenseViewSet) # -> '/api/expenses/'
router.register(r'budgets', BudgetViewSet) # -> '/api/budgets/'

# '/api/auth/register/' ONLY FOR POST ROUTE (no need to write it, it's taken care of by dj-rest-auth + django-allauth)
# '/api/auth/login/' ONLY FOR POST ROUTE (no need to write it, it's taken care of by dj-rest-auth + django-allauth)
# '/api/auth/logout/' ONLY FOR POST ROUTE (no need to write it, it's taken care of by dj-rest-auth + django-allauth)

urlpatterns = [
    path('', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')), # Default dj-rest-auth authentication routes
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Route to obtain a token
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Route to refresh a token
    path('user/current/', LoggedInUserUpdateView.as_view(), name="user-update"), # Route (protected by a token) to update a logged in user -> will be "http://localhost:8000/api/user/current/" because of urlpatterns in back_previsionnel/urls.py (no nedd to add another "api" here in the url)
    path('user/current/details/', LoggedInUserDetailView.as_view(), name="user-details"), # Route (protected by a token) to get a logged in user's details / info
    path('user/current/delete', LoggedInUserDeleteView.as_view(), name="user-delete"), # Route (protected by a token) to delete the current logged in user
]