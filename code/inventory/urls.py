from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, ProductInventoryViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'inventories', ProductInventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
