from rest_framework import viewsets
from .models import Warehouse, ProductInventory, InventoryTransaction
from .serializers import WarehouseSerializer, ProductInventorySerializer, InventoryTransactionSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    # ViewSet for the Warehouse model.
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class ProductInventoryViewSet(viewsets.ModelViewSet):
    # ViewSet for the ProductInventory model.
    queryset = ProductInventory.objects.all()
    serializer_class = ProductInventorySerializer

class InventoryTransactionViewSet(viewsets.ModelViewSet):
    # ViewSet for the InventoryTransaction model.
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer
