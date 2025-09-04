from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from catalog.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    # Serializer for CartItem, including product details.
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'product_details']
        read_only_fields = ['cart']

class CartSerializer(serializers.ModelSerializer):
    # Serializer for Cart, including all its items.
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

class OrderItemSerializer(serializers.ModelSerializer):
    # Serializer for OrderItem.
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    # Serializer for Order, including all its items.
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'total_price', 'status', 'items']
