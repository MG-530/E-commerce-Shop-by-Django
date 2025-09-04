from rest_framework import viewsets
from .models import Category, Product, Discount
from .serializers import CategorySerializer, ProductSerializer, DiscountSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for categories. Read-only for public access.
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for products. Read-only for public access.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for discounts. Read-only for public access.
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
