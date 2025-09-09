from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Payment, Shipment
from catalog.serializers import ProductSerializer
from catalog.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    # Serializer for the CartItem model.
    cart = serializers.PrimaryKeyRelatedField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'cart', 'product', 'product_id', 'quantity', 'total_price')

    def get_total_price(self, obj):
        try:
            return float(obj.product.price) * obj.quantity
        except Exception:
            return None

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

class CartSerializer(serializers.ModelSerializer):
    # Serializer for the Cart model.
    items = CartItemSerializer(many=True, read_only=True, source='cartitem_set')
    total_amount = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_amount', 'item_count')

    def get_total_amount(self, obj):
        total = 0.0
        for item in obj.cartitem_set.all():
            try:
                total += float(item.product.price) * item.quantity
            except Exception:
                continue
        return total

    def get_item_count(self, obj):
        return obj.cartitem_set.count()
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

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
