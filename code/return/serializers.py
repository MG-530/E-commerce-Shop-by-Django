from rest_framework import serializers
from .models import ReturnRequest, ReturnItem

class ReturnItemSerializer(serializers.ModelSerializer):
    # Serializer for return items.
    class Meta:
        model = ReturnItem
        fields = '__all__'

class ReturnRequestSerializer(serializers.ModelSerializer):
    # Serializer for return requests.
    items = ReturnItemSerializer(many=True, read_only=True)

    class Meta:
        model = ReturnRequest
        fields = ['id', 'order', 'user', 'status', 'reason', 'refund_amount', 'tracking_number', 'shipment_status', 'items']
        read_only_fields = ['user', 'refund_amount']
