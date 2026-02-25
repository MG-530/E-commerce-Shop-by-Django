from django.contrib import admin
from .models import Category, Discount, Product, Comment, Bundle, BundleProduct

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # Admin configuration for the Category model.
    list_display = ('name', 'parent_category')
    search_fields = ('name',)

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    # Admin configuration for the Discount model.
    list_display = ('description', 'value', 'discount_type', 'start_date', 'end_date')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Admin configuration for the Product model.
    list_display = ('product_name', 'sku', 'price', 'category', 'status')
    search_fields = ('product_name', 'sku')
    list_filter = ('category', 'status')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    # Admin configuration for the Comment model.
    list_display = ('product', 'user', 'star', 'likes_count', 'dislikes_count')
    search_fields = ('product__product_name', 'user__username')
    list_filter = ('star',)

@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    # Admin configuration for the Bundle model.
    list_display = ('name', 'status')
    search_fields = ('name',)

@admin.register(BundleProduct)
class BundleProductAdmin(admin.ModelAdmin):
    # Admin configuration for the BundleProduct model.
    list_display = ('bundle', 'product', 'quantity')
    list_filter = ('bundle',)
