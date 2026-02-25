from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from wishlist.models import Wishlist, WishlistItem

User = get_user_model()

class WishlistAPITest(APITestCase):
    # Test cases for the Wishlist API.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('my-wishlist')

    def test_get_user_wishlist(self):
        # Test retrieving the user's wishlist.
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.id)
