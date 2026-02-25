from django.test import TestCase
from django.contrib.auth import get_user_model
from wishlist.models import Wishlist, WishlistItem
from catalog.models import Product, Category

User = get_user_model()

class WishlistModelTest(TestCase):
    # Test cases for the Wishlist model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.wishlist = Wishlist.objects.create(user=self.user)
    
    def test_wishlist_creation(self):
        # Test if a wishlist is created.
        self.assertEqual(self.wishlist.user.username, 'testuser')
    
    def test_wishlist_str(self):
        # Test the string representation.
        self.assertEqual(str(self.wishlist), 'Wishlist of testuser')
