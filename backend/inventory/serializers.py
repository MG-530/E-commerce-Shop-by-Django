from rest_framework import serializers
from .models import Warehouse, ProductInventory, InventoryTransaction

class WarehouseSerializer(serializers.ModelSerializer):
    # Serializer for the Warehouse model.
    class Meta:
        model = Warehouse
        fields = '__all__'

class ProductInventorySerializer(serializers.ModelSerializer):
    # Serializer for the ProductInventory model.
    class Meta:
        model = ProductInventory
        fields = '__all__'

class InventoryTransactionSerializer(serializers.ModelSerializer):
    # Serializer for the InventoryTransaction model.
    class Meta:
        model = InventoryTransaction
        fields = '__all__'
