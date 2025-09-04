from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from return.models import ReturnRequest
from orders.models import Order, OrderItem
from catalog.models import Product, Category

User = get_user_model()

class ReturnRequestAPITest(APITestCase):
    # Test cases for the ReturnRequest API.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.order = Order.objects.create(user=self.user, total_price=100.00, status='completed')
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('returnrequest-list')

    def test_create_return_request(self):
        # Test creating a new return request.
        data = {
            'order': self.order.id,
            'user': self.user.id,
            'status': 'pending',
            'reason': 'Item is not as described',
            'refund_amount': 90.00
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReturnRequest.objects.count(), 1)
