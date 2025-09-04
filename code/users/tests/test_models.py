from django.test import TestCase
from users.models import User, Address

class UserModelTest(TestCase):
    # Test cases for the User model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')

    def test_user_creation(self):
        # Test if a user can be created successfully.
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.is_active)

    def test_user_str(self):
        # Test the string representation of the User model.
        self.assertEqual(str(self.user), 'testuser')

class AddressModelTest(TestCase):
    # Test cases for the Address model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.address = Address.objects.create(user=self.user, street='123 Main St', city='Anytown', state='CA', zip_code='12345')

    def test_address_creation(self):
        # Test if an address can be created successfully.
        self.assertEqual(self.address.street, '123 Main St')
        self.assertEqual(self.address.user.username, 'testuser')
    
    def test_address_str(self):
        # Test the string representation of the Address model.
        self.assertEqual(str(self.address), '123 Main St, Anytown')
