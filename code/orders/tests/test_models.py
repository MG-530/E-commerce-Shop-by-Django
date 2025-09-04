from django.test import TestCase
from django.contrib.auth import get_user_model
from orders.models import Cart, CartItem, Order, OrderItem
from catalog.models import Product, Category, Discount

User = get_user_model()

class CartModelTest(TestCase):
    # Test cases for the Cart model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.cart = Cart.objects.create(user=self.user)
    
    def test_cart_creation(self):
        # Test if a cart is created correctly.
        self.assertEqual(self.cart.user.username, 'testuser')
    
    def test_cart_str(self):
        # Test the string representation.
        self.assertEqual(str(self.cart), 'Cart of testuser')

class CartItemModelTest(TestCase):
    # Test cases for the CartItem model.
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
        self.cart = Cart.objects.create(user=self.user)
        self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)

    def test_cart_item_creation(self):
        # Test if a cart item is created correctly.
        self.assertEqual(self.cart_item.product.product_name, 'Laptop')
        self.assertEqual(self.cart_item.quantity, 1)

    def test_cart_item_str(self):
        # Test the string representation.
        self.assertEqual(str(self.cart_item), f"{self.product.product_name} in {self.cart.user.username}'s cart")

class OrderModelTest(TestCase):
    # Test cases for the Order model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.order = Order.objects.create(user=self.user, total_price=100.00, status='pending')
    
    def test_order_creation(self):
        # Test if an order is created correctly.
        self.assertEqual(self.order.user.username, 'testuser')
        self.assertEqual(self.order.total_price, 100.00)

    def test_order_str(self):
        # Test the string representation.
        self.assertEqual(str(self.order), f'Order #{self.order.id} by testuser')

class OrderItemModelTest(TestCase):
    # Test cases for the OrderItem model.
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
        self.order = Order.objects.create(user=self.user, total_price=1200.00, status='pending')
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=1200.00)

    def test_order_item_creation(self):
        # Test if an order item is created correctly.
        self.assertEqual(self.order_item.product.product_name, 'Laptop')
        self.assertEqual(self.order_item.quantity, 1)

    def test_order_item_str(self):
        # Test the string representation.
        self.assertEqual(str(self.order_item), f"{self.order_item.product.product_name} in order #{self.order.id}")
