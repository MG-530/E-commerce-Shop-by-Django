from django.contrib import admin
from .models import Warehouse, ProductInventory, InventoryTransaction

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    # Admin configuration for Warehouse model.
    list_display = ('Name', 'Location', 'status')
    search_fields = ('Name', 'Location')

@admin.register(ProductInventory)
class ProductInventoryAdmin(admin.ModelAdmin):
    # Admin configuration for ProductInventory model.
    list_display = ('product', 'warehouse', 'Quantity', 'status', 'Last_Updated')
    list_filter = ('warehouse', 'status')
    search_fields = ('product__product_name', 'warehouse__Name')

@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    # Admin configuration for InventoryTransaction model.
    list_display = ('product', 'warehouse', 'Quantity', 'Type', 'timestamp')
    list_filter = ('Type', 'warehouse')
    search_fields = ('product__product_name', 'warehouse__Name')
