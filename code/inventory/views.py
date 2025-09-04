from rest_framework import viewsets
from .models import Warehouse, ProductInventory
from .serializers import WarehouseSerializer, ProductInventorySerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    # ViewSet for warehouses.
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class ProductInventoryViewSet(viewsets.ModelViewSet):
    # ViewSet for product inventory.
    queryset = ProductInventory.objects.all()
    serializer_class = ProductInventorySerializer
