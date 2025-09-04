from rest_framework import viewsets
from .models import Category, Discount, Product, Comment, Bundle, BundleProduct
from .serializers import CategorySerializer, DiscountSerializer, ProductSerializer, CommentSerializer, BundleSerializer, BundleProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    # ViewSet for the Category model.
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class DiscountViewSet(viewsets.ModelViewSet):
    # ViewSet for the Discount model.
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

class ProductViewSet(viewsets.ModelViewSet):
    # ViewSet for the Product model.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CommentViewSet(viewsets.ModelViewSet):
    # ViewSet for the Comment model.
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class BundleViewSet(viewsets.ModelViewSet):
    # ViewSet for the Bundle model.
    queryset = Bundle.objects.all()
    serializer_class = BundleSerializer

class BundleProductViewSet(viewsets.ModelViewSet):
    # ViewSet for the BundleProduct model.
    queryset = BundleProduct.objects.all()
    serializer_class = BundleProductSerializer
