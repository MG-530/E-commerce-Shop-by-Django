from django.db import models
from django.conf import settings
from catalog.models import Product

class Vendor(models.Model):
    # Vendor model based on DBML, linked to the User model.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    shop_name = models.CharField(max_length=255)
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.shop_name

class VendorProduct(models.Model):
    # Many-to-many relationship between Vendor and Product.
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('vendor', 'product')

    def __str__(self):
        return f"{self.vendor.shop_name} sells {self.product.product_name}"

class VendorReview(models.Model):
    # Reviews for vendors.
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    comment = models.TextField()

    def __str__(self):
        return f"Review for {self.vendor.shop_name} by {self.user.username}"
