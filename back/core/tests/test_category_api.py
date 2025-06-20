from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from django.urls import reverse
from core.models import Category

class CategoryAPITest(APITestCase):
    def setUp(self):
        # create a user to test the authentication
        self.user = User.objects.create_user(username="usertest", password="password123")
        self.client.login(username="usertest", password="password123")
        self.client.force_authenticate(user=self.user)  # Directly authenticate the client ('cause we normally need a token)
        self.url = reverse('category-list') # generate '/api/categories/'
    
    # create a category through the API (POST REQUEST)
    def test_create_category(self):
        data = {'name': 'Salaire', 'type': 'INCOME'}
        response = self.client.post(self.url, data)

        # print(response.data) # debug

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().name, 'Salaire')
    
    def test_get_category_list(self):
        # Django tests use a temporary, empty database every time they run a new test
        # that's why we have to create (directly in DB) a new category even though we already created one in "def test_create_category(self):"

        # Proceeding like this guarantee that :
            # The tests are independent of each other ;
            # The results are predictable and independent ;
            # A failing test does not break the others ;
        
        Category.objects.create(name="Vêtements", type='EXPENSE', user=self.user)
        response = self.client.get(self.url)

        # debug
        # print(response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Vêtements')