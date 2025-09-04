from django.db import models

class Discount(models.Model):
    # Discount model based on DBML.
    value = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.discount_type} - {self.value}"

class Category(models.Model):
    # Category model with self-referencing for parent categories.
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    # Product model with relationships to Category and Discount.
    SKU = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.product_name
