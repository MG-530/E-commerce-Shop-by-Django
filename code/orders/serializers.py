from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Payment, Shipment

class CartItemSerializer(serializers.ModelSerializer):
    # Serializer for the CartItem model.
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    # Serializer for the Cart model.
    items = CartItemSerializer(many=True, read_only=True, source='cartitem_set')
    
    class Meta:
        model = Cart
        fields = ('id', 'user', 'items')

class OrderItemSerializer(serializers.ModelSerializer):
    # Serializer for the OrderItem model.
    class Meta:
        model = OrderItem
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    # Serializer for the Payment model.
    class Meta:
        model = Payment
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    # Serializer for the Shipment model.
    class Meta:
        model = Shipment
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    # Serializer for the Order model.
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    payments = PaymentSerializer(many=True, read_only=True)
    shipments = ShipmentSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'order_date', 'total_price', 'status', 'items', 'payments', 'shipments')
