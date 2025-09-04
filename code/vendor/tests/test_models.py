from django.test import TestCase
from django.contrib.auth import get_user_model
from vendor.models import Vendor

User = get_user_model()

class VendorModelTest(TestCase):
    # Test cases for the Vendor model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.vendor = Vendor.objects.create(user=self.user, shop_name='My Awesome Shop')
    
    def test_vendor_creation(self):
        # Test if a vendor is created.
        self.assertEqual(self.vendor.shop_name, 'My Awesome Shop')

    def test_vendor_str(self):
        # Test the string representation.
        self.assertEqual(str(self.vendor), 'My Awesome Shop')
