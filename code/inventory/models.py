from django.db import models
from django.conf import settings
from catalog.models import Product

class Warehouse(models.Model):
    # Model for warehouses.
    Warehouse_ID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=255)
    Location = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='active')

    def __str__(self):
        return self.Name

class ProductInventory(models.Model):
    # Model for product inventory in a specific warehouse.
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    Quantity = models.IntegerField()
    Minimum_Quantity = models.IntegerField(null=True, blank=True)
    Maximum_Quantity = models.IntegerField(null=True, blank=True)
    Last_Updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, default='in_stock')

    class Meta:
        unique_together = ('product', 'warehouse')
        verbose_name_plural = 'Product Inventories'

    def __str__(self):
        return f'{self.product.product_name} in {self.warehouse.Name}'

class InventoryTransaction(models.Model):
    # Model to track inventory movements.
    Transaction_ID = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    Quantity = models.IntegerField()
    Type = models.CharField(max_length=50)
    Reference_Type = models.CharField(max_length=50)
    Reference_ID = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.Type} transaction for {self.product.product_name}'
