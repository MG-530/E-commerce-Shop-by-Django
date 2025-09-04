from django.db import models
from django.conf import settings
from catalog.models import Product

class Wishlist(models.Model):
    # A user's wishlist.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')

    def __str__(self):
        return f"Wishlist of {self.user.username}"

class WishlistItem(models.Model):
    # Items in a wishlist.
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('wishlist', 'product')

    def __str__(self):
        return f"{self.product.product_name} in {self.wishlist.user.username}'s wishlist"
