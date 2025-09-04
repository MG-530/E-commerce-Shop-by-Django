from rest_framework import serializers
from .models import Warehouse, ProductInventory

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
