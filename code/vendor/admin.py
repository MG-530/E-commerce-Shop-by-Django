from django.contrib import admin
from .models import Vendor, VendorProduct, VendorReview

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('user', 'shop_name', 'rating', 'status')
    search_fields = ('shop_name', 'user__username')

@admin.register(VendorProduct)
class VendorProductAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'product')

@admin.register(VendorReview)
class VendorReviewAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'user', 'rating')
    list_filter = ('rating',)
