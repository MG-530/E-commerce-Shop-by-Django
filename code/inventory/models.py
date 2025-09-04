from django.db import models
from catalog.models import Product

class Warehouse(models.Model):
    # Warehouse model based on DBML.
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class ProductInventory(models.Model):
    # Inventory for each product in each warehouse.
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventories')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventories')
    quantity = models.PositiveIntegerField()
    minimum_quantity = models.PositiveIntegerField(default=0)
    maximum_quantity = models.PositiveIntegerField(default=99999)
    last_updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50)

    class Meta:
        # Each product can only have one entry per warehouse.
        unique_together = ('product', 'warehouse')
        verbose_name_plural = "Product Inventories"

    def __str__(self):
        return f"{self.product.product_name} in {self.warehouse.name}"
