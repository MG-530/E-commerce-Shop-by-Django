from rest_framework import serializers
from .models import Category, Discount, Product, Comment, Bundle, BundleProduct, UserDiscount

class CategorySerializer(serializers.ModelSerializer):
    # Serializer for the Category model.
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'parent_category', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.count()

class DiscountSerializer(serializers.ModelSerializer):
    # Serializer for the Discount model.
    class Meta:
        model = Discount
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Serializer for the Product model.
    name = serializers.CharField(source='product_name')
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'product_name', 'description', 'price', 'weight', 'dimensions', 
                 'status', 'sku', 'category', 'category_name', 'vendor', 'rating', 'image_url', 
                 'discount_percentage', 'discount')
    
    def get_vendor(self, obj):
        # For now, return a default vendor. You can add a vendor field to the Product model later
        return "Default Vendor"
    
    def get_rating(self, obj):
        # Calculate average rating from comments
        comments = obj.comments.all()
        if comments.exists():
            total_stars = sum(comment.star for comment in comments)
            return round(total_stars / comments.count(), 1)
        return None
    
    def get_image_url(self, obj):
        # Return the image URL if available, otherwise return a placeholder
        if obj.image_url:
            return obj.image_url
        elif obj.image:
            return obj.image.url
        else:
            return f"/placeholder.svg?height=200&width=300&query={obj.product_name}"
    
    def get_discount_percentage(self, obj):
        if obj.discount and obj.discount.discount_type == 'percentage':
            return float(obj.discount.value)
        return None

class CommentSerializer(serializers.ModelSerializer):
    # Serializer for the Comment model.
    class Meta:
        model = Comment
        fields = '__all__'

class BundleSerializer(serializers.ModelSerializer):
    # Serializer for the Bundle model.
    class Meta:
        model = Bundle
        fields = '__all__'

class BundleProductSerializer(serializers.ModelSerializer):
    # Serializer for the BundleProduct model.
    class Meta:
        model = BundleProduct
        fields = '__all__'

class UserDiscountSerializer(serializers.ModelSerializer):
    # Serializer for the UserDiscount model.
    class Meta:
        model = UserDiscount
        fields = '__all__'
