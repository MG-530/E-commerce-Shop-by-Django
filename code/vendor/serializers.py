from rest_framework import serializers
from .models import Vendor, VendorProduct, VendorReview

class VendorSerializer(serializers.ModelSerializer):
    # Serializer for the Vendor model.
    class Meta:
        model = Vendor
        fields = '__all__'

class VendorProductSerializer(serializers.ModelSerializer):
    # Serializer for the VendorProduct model.
    class Meta:
        model = VendorProduct
        fields = '__all__'

class VendorReviewSerializer(serializers.ModelSerializer):
    # Serializer for VendorReview.
    class Meta:
        model = VendorReview
        fields = '__all__'
