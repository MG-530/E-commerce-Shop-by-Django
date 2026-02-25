from django.db import models
from django.conf import settings
from catalog.models import Product
from users.models import Address
from catalog.models import Discount

class Cart(models.Model):
    # Shopping cart for a user.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    # Items within a shopping cart.
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.product.product_name} in {self.cart.user.username}'s cart"

class Order(models.Model):
    # User's order.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50) # e.g., 'pending', 'processing', 'shipped', 'completed', 'canceled'
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

class OrderItem(models.Model):
    # Items within an order.
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.product_name} in order #{self.order.id}"

class Payment(models.Model):
    # Payment details for an order.
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment for Order #{self.order.id}"

class Shipment(models.Model):
    # Shipment details for an order.
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    shipment_date = models.DateTimeField(blank=True, null=True)
    carrier = models.CharField(max_length=100)
    tracking_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50) # e.g., 'pending', 'shipped', 'delivered'

    def __str__(self):
        return f"Shipment for Order #{self.order.id}"
