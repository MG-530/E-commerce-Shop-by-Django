from django.contrib import admin
from .models import Warehouse, ProductInventory

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'location')

@admin.register(ProductInventory)
class ProductInventoryAdmin(admin.ModelAdmin):
    list_display = ('product', 'warehouse', 'quantity', 'status', 'last_updated')
    list_filter = ('warehouse', 'status')
    search_fields = ('product__product_name', 'warehouse__name')
