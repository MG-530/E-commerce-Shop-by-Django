from rest_framework import serializers
from .models import Category, Discount, Product, Comment, Bundle, BundleProduct

class CategorySerializer(serializers.ModelSerializer):
    # Serializer for the Category model.
    class Meta:
        model = Category
        fields = '__all__'

class DiscountSerializer(serializers.ModelSerializer):
    # Serializer for the Discount model.
    class Meta:
        model = Discount
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Serializer for the Product model.
    class Meta:
        model = Product
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    # Serializer for the Comment model.
    class Meta:
        model = Comment
        fields = '__all__'

class BundleProductSerializer(serializers.ModelSerializer):
    # Serializer for the BundleProduct model.
    class Meta:
        model = BundleProduct
        fields = '__all__'

class BundleSerializer(serializers.ModelSerializer):
    # Serializer for the Bundle model.
    products = BundleProductSerializer(many=True, read_only=True, source='bundleproduct_set')
    
    class Meta:
        model = Bundle
        fields = '__all__'
