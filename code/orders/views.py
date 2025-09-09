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
    
    def list(self, request, *args, **kwargs):
        # Return (or create) the authenticated user's cart as a single object
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
        
class CartItemViewSet(viewsets.ModelViewSet):
    # ViewSet for cart items.
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Ensure a user can only access their own cart items.
        return CartItem.objects.filter(cart__user=self.request.user)
    
    def perform_create(self, serializer):
        # Get or create the user's cart and save new item
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)

    def create(self, request, *args, **kwargs):
        # Upsert behavior: if the product already exists in cart, increment quantity
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        existing_item = CartItem.objects.filter(cart=cart, product=product).first()
        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
            output_serializer = self.get_serializer(existing_item)
            headers = self.get_success_headers(output_serializer.data)
            return Response(output_serializer.data, status=status.HTTP_200_OK, headers=headers)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
        cart, _ = Cart.objects.get_or_create(user=user)
        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Use a database transaction to ensure data integrity
        with transaction.atomic():
            # 1. Check inventory for all items in the cart.
            for item in cart_items:
                product_inventory = ProductInventory.objects.filter(product=item.product).first()
                if not product_inventory:
                    return Response({"error": f"Inventory not found for {item.product.product_name}"}, status=status.HTTP_400_BAD_REQUEST)
                if product_inventory.Quantity < item.quantity:
                    return Response({"error": f"Not enough stock for {item.product.product_name}"}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Calculate total price and apply discounts.
            total_price = sum(item.product.price * item.quantity for item in cart_items)
            
            # Apply user-specific discounts (mock logic).
            user_discounts = user.userdiscount_set.all()
            if user_discounts.exists():
                # For this example, apply the first valid discount found.
                discount_amount = user_discounts.first().discount.value
                total_price -= discount_amount

            # 3. Determine shipping address: optional address_id from request, otherwise first address
            address_id = request.data.get('address_id') if isinstance(request.data, dict) else None
            user_address = None
            if address_id:
                user_address = user.address_set.filter(pk=address_id).first()
                if not user_address:
                    return Response({"error": "Invalid address_id for user."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user_address = user.address_set.first()
                if not user_address:
                    return Response({"error": "User has no address on file."}, status=status.HTTP_400_BAD_REQUEST)

            order = Order.objects.create(
                user=user,
                total_price=total_price,
                status='pending',
                address=user_address # Assuming user has at least one address
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
                product_inventory.Quantity -= item.quantity
                product_inventory.save()

            # 5. Clear the user's cart.
            cart.delete()

        return Response({"message": "Order created successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)

