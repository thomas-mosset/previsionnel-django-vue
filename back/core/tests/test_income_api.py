from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from django.urls import reverse
from core.models import Income, Category

class IncomeAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="usertest", password="password123")
        self.client.login(username="usertest", password="password123")
        self.client.force_authenticate(user=self.user)
        self.url = reverse('income-list')
    
    def test_create_income(self):
        # category creation because we need it to create an income
        category = Category.objects.create(name='Salaire', type='INCOME', user=self.user)

        data = {
            "category": category.id,
            "amount": 2000,
            "date": "2025-06-20",
            "description": "Salaire de juin"
        }
        response = self.client.post(self.url, data)

        # debug print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Income.objects.count(), 1)
        self.assertEqual(Income.objects.get().description, 'Salaire de juin')
    
    def test_get_income_list(self):
        # create quickly a category + an income ...
        category = Category.objects.create(name='Salaire', type='INCOME', user=self.user)

        Income.objects.create(category=category, amount=2000, date="2025-06-20", description="Salaire de juin", user=self.user)

        response = self.client.get(self.url)

        # ... to test the GET request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['description'], "Salaire de juin")
    
    def test_update_income(self):
        # create quickly a category + an income ...
        category = Category.objects.create(name='Salaire', type='INCOME', user=self.user)

        income = Income.objects.create(category=category, amount=2000, date="2025-06-20", description="Salaire de juin", user=self.user)

        # generate "/api/incomes/<id>/"
        url = reverse('income-detail', args=[income.id]) # [income.id] = id of our object
        data = {
            "amount": 2500,
            "description": "Salaire de juin mis à jour"
        }

        # "patch" because we only update our data partially (else we would have user "put")
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        income.refresh_from_db() # reload from the database to check for changes
        self.assertEqual(income.amount, 2500)
        self.assertEqual(income.description, "Salaire de juin mis à jour")

    def test_delete_income(self):
        # create quickly a category + an income ...
        category = Category.objects.create(name='Salaire', type='INCOME', user=self.user)

        income = Income.objects.create(category=category, amount=2000, date="2025-06-20", description="Salaire de juin", user=self.user)

        # create url
        url = reverse('income-detail', args=[income.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) # delete ok 
        self.assertFalse(Income.objects.filter(id=income.id).exists()) # check that object is gone