from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem, Payment, Shipment
from catalog.models import Product
from inventory.models import ProductInventory
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, PaymentSerializer, ShipmentSerializer

class CartViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    # ViewSet for a user's cart.
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure a user can only access their own cart.
        return Cart.objects.filter(user=self.request.user)
        
class CartItemViewSet(viewsets.ModelViewSet):
    # ViewSet for cart items.
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Ensure a user can only access their own cart items.
        return CartItem.objects.filter(cart__user=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    # ViewSet for a user's orders.
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Ensure a user can only access their own orders.
        return Order.objects.filter(user=self.request.user)

class OrderItemViewSet(viewsets.ModelViewSet):
    # ViewSet for order items.
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Ensure a user can only access their own order items.
        return OrderItem.objects.filter(order__user=self.request.user)

class PaymentViewSet(viewsets.ModelViewSet):
    # ViewSet for payments.
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
class ShipmentViewSet(viewsets.ModelViewSet):
    # ViewSet for shipments.
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

class PurchaseViewSet(viewsets.ViewSet):
    # Handles the complete purchase process.
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_order_from_cart(self, request):
        user = request.user
        cart = Cart.objects.get(user=user)
        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Use a database transaction to ensure data integrity
        with transaction.atomic():
            # 1. Check inventory for all items in the cart.
            for item in cart_items:
                product_inventory = ProductInventory.objects.get(product=item.product)
                if product_inventory.quantity < item.quantity:
                    return Response({"error": f"Not enough stock for {item.product.product_name}"}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Calculate total price and apply discounts.
            total_price = sum(item.product.price * item.quantity for item in cart_items)
            
            # Apply user-specific discounts (mock logic).
            user_discounts = user.userdiscount_set.all()
            if user_discounts.exists():
                # For this example, apply the first valid discount found.
                discount_amount = user_discounts.first().discount.value
                total_price -= discount_amount

            # 3. Create the order and its items.
            order = Order.objects.create(
                user=user,
                total_price=total_price,
                status='pending',
                address=user.address_set.first() # Assuming user has at least one address
            )
            
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price # Use the product's price at the time of purchase
                )
                
                # 4. Reduce product inventory.
                product_inventory = ProductInventory.objects.get(product=item.product)
                product_inventory.quantity -= item.quantity
                product_inventory.save()

            # 5. Clear the user's cart.
            cart.delete()

        return Response({"message": "Order created successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)

