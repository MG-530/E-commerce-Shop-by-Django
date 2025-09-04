from django.db import models
from django.conf import settings

# A helper class for common fields used in products.
class ProductCommon(models.Model):
    product_name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    dimensions = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    
    class Meta:
        abstract = True

class Category(models.Model):
    # Product categories.
    name = models.CharField(max_length=255)
    description = models.TextField()
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    def __str__(self):
        return self.name

class Discount(models.Model):
    # Discount codes.
    value = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(max_length=50) # e.g., 'percentage', 'fixed_amount'
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    description = models.TextField()

    def __str__(self):
        return self.description

class UserDiscount(models.Model):
    # Specific discounts for individual users.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'discount')

    def __str__(self):
        return f"{self.user.username} has discount {self.discount.description}"

class Product(ProductCommon):
    # Product model with foreign keys to Category and Discount.
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.product_name

class Comment(models.Model):
    # Product reviews and comments.
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    star = models.IntegerField()
    likes_count = models.IntegerField(default=0)
    dislikes_count = models.IntegerField(default=0)
    reply_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f"Comment by {self.user.username} on {self.product.product_name}"

# Bundles
class Bundle(models.Model):
    # Product bundles.
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class BundleProduct(models.Model):
    # Products in a bundle.
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('bundle', 'product')

    def __str__(self):
        return f"{self.product.product_name} in {self.bundle.name}"
