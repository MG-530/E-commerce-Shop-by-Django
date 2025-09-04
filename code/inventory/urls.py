from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, ProductInventoryViewSet, InventoryTransactionViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'inventories', ProductInventoryViewSet)
router.register(r'transactions', InventoryTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
