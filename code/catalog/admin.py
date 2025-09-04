from django.contrib import admin
from .models import Category, Product, Discount

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category')
    search_fields = ('name',)
    list_filter = ('parent_category',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'SKU', 'price', 'category', 'status')
    list_filter = ('category', 'status')
    search_fields = ('product_name', 'SKU')

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('description', 'value', 'discount_type', 'start_date', 'end_date')
    search_fields = ('description',)
