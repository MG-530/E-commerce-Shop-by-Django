
from django.test import TestCase
from catalog.models import Category, Product, Discount, Comment, Bundle, BundleProduct

class CategoryModelTest(TestCase):
    # Test cases for the Category model.
    def setUp(self):
        self.category = Category.objects.create(name='Electronics', description='Electronic devices.')

    def test_category_creation(self):
        # Test if a category can be created.
        self.assertEqual(self.category.name, 'Electronics')
    
    def test_category_str(self):
        # Test the string representation.
        self.assertEqual(str(self.category), 'Electronics')

class ProductModelTest(TestCase):
    # Test cases for the Product model.
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

    def test_product_creation(self):
        # Test if a product can be created.
        self.assertEqual(self.product.product_name, 'Laptop')
        self.assertEqual(self.product.sku, 'LAPTOP123')
    
    def test_product_str(self):
        # Test the string representation.
        self.assertEqual(str(self.product), 'Laptop')
