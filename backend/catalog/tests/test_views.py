from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from catalog.models import Category, Product, Discount, Comment, Bundle, BundleProduct

class CategoryAPITest(APITestCase):
    # Test cases for the Category API.
    def setUp(self):
        self.list_url = reverse('category-list')
        self.category = Category.objects.create(name='Electronics', description='Electronic devices.')
        self.detail_url = reverse('category-detail', args=[self.category.id])

    def test_list_categories(self):
        # Test retrieving a list of categories.
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_category(self):
        # Test retrieving a single category.
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Electronics')

class ProductAPITest(APITestCase):
    # Test cases for the Product API.
    def setUp(self):
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
        self.list_url = reverse('product-list')
    
    def test_list_products(self):
        # Test retrieving a list of products.
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
