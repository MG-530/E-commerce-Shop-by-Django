from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Payment, Shipment

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    # Admin configuration for the Cart model.
    list_display = ('user',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    # Admin configuration for the CartItem model.
    list_display = ('cart', 'product', 'quantity')
    search_fields = ('product__product_name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Admin configuration for the Order model.
    list_display = ('user', 'order_date', 'total_price', 'status')
    list_filter = ('status', 'order_date')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    # Admin configuration for the OrderItem model.
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('product__product_name',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    # Admin configuration for the Payment model.
    list_display = ('order', 'amount', 'payment_method', 'payment_date')
    list_filter = ('payment_method',)

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    # Admin configuration for the Shipment model.
    list_display = ('order', 'carrier', 'tracking_number', 'status', 'shipment_date')
    list_filter = ('status', 'carrier')
    search_fields = ('tracking_number',)
