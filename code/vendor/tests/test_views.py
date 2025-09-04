from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from vendor.models import Vendor

User = get_user_model()

class VendorAPITest(APITestCase):
    # Test cases for the Vendor API.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.vendor = Vendor.objects.create(user=self.user, shop_name='My Awesome Shop')
        self.list_url = reverse('vendor-list')

    def test_list_vendors(self):
        # Test retrieving a list of vendors.
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
