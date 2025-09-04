from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem, Payment, Shipment
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, PaymentSerializer, ShipmentSerializer

class CartViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    # ViewSet for the Cart model.
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the user's cart or create a new one.
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class CartItemViewSet(viewsets.ModelViewSet):
    # ViewSet for the CartItem model.
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    # ViewSet for the Order model.
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own orders.
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user for new orders.
        serializer.save(user=self.request.user)


class OrderItemViewSet(viewsets.ModelViewSet):
    # ViewSet for the OrderItem model.
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    # ViewSet for the Payment model.
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ShipmentViewSet(viewsets.ModelViewSet):
    # ViewSet for the Shipment model.
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
