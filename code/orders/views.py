from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer

class CartViewSet(viewsets.ModelViewSet):
    # ViewSet for the user's shopping cart.
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see their own cart.
        return self.queryset.filter(user=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    # ViewSet for items within a cart.
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see items in their own cart.
        return self.queryset.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the cart for the new item.
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for a user's orders.
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see their own orders.
        return self.queryset.filter(user=self.request.user)

class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for items within a specific order.
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see items from their own orders.
        return self.queryset.filter(order__user=self.request.user)
