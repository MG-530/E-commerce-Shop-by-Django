from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from users.models import User, Address

class UserAPITest(APITestCase):
    # Test cases for the User API.
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.list_url = reverse('user-list')

    def test_create_user(self):
        # Test creating a new user.
        new_user_data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword'
        }
        response = self.client.post(self.list_url, new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
