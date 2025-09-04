from rest_framework import serializers
from .models import Category, Product, Discount

class DiscountSerializer(serializers.ModelSerializer):
    # Serializer for the Discount model.
    class Meta:
        model = Discount
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    # Serializer for the Category model.
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Serializer for the Product model, including related fields.
    category = serializers.SlugRelatedField(queryset=Category.objects.all(), slug_field='name')
    discount = serializers.SlugRelatedField(queryset=Discount.objects.all(), slug_field='description')
    
    class Meta:
        model = Product
        fields = '__all__'
