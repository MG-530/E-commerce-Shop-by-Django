from django.test import TestCase
from django.contrib.auth import get_user_model
from return.models import ReturnRequest, ReturnItem
from orders.models import Order, OrderItem
from catalog.models import Product, Category

User = get_user_model()

class ReturnRequestModelTest(TestCase):
    # Test cases for the ReturnRequest model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.order = Order.objects.create(user=self.user, total_price=100.00, status='completed')
        self.return_request = ReturnRequest.objects.create(
            order=self.order,
            user=self.user,
            status='pending',
            reason='Damaged item',
            refund_amount=100.00
        )

    def test_return_request_creation(self):
        # Test if a return request is created.
        self.assertEqual(self.return_request.user.username, 'testuser')
        self.assertEqual(self.return_request.status, 'pending')

    def test_return_request_str(self):
        # Test the string representation.
        self.assertEqual(str(self.return_request), f'Return for Order #{self.order.id}')
