from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from orders.models import Cart, CartItem, Order, OrderItem
from catalog.models import Product, Category

User = get_user_model()

class CartAPITest(APITestCase):
    # Test cases for the Cart API.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.category = Category.objects.create(name='Electronics', description='Electronic devices.')
        self.product = Product.objects.create(
            product_name='Laptop', 
            sku='LAPTOP123',
            description='A powerful laptop.',
            price=1200.00,
            weight=2.5,
            dimensions='30x20x2 cm',
            status='available',
            category=self.category
        )
        self.client.force_authenticate(user=self.user)

    def test_get_user_cart(self):
        # Test retrieving the user's cart.
        url = reverse('cart-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.id)
