from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, CartItemViewSet, OrderViewSet, OrderItemViewSet, PaymentViewSet, ShipmentViewSet, PurchaseViewSet

router = DefaultRouter()
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='order/cart-item')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-items', OrderItemViewSet, basename='order-item')
router.register(r'payments', PaymentViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'purchase', PurchaseViewSet, basename='purchase')

urlpatterns = [
    path('', include(router.urls)),
]
