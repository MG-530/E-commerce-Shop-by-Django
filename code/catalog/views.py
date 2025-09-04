from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Discount, Product, Comment, Bundle, BundleProduct, UserDiscount
from .serializers import CategorySerializer, DiscountSerializer, ProductSerializer, CommentSerializer, BundleSerializer, BundleProductSerializer, UserDiscountSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    # ViewSet for categories.
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DiscountViewSet(viewsets.ModelViewSet):
    # ViewSet for discounts.
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAdminUser]

class ProductViewSet(viewsets.ModelViewSet):
    # ViewSet for products with filtering and searching.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'price']
    search_fields = ['product_name', 'description', 'sku']
    ordering_fields = ['price', 'product_name']

class CommentViewSet(viewsets.ModelViewSet):
    # ViewSet for comments.
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BundleViewSet(viewsets.ModelViewSet):
    # ViewSet for bundles.
    queryset = Bundle.objects.all()
    serializer_class = BundleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BundleProductViewSet(viewsets.ModelViewSet):
    # ViewSet for bundle products.
    queryset = BundleProduct.objects.all()
    serializer_class = BundleProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class UserDiscountViewSet(viewsets.ModelViewSet):
    # ViewSet for user discounts.
    queryset = UserDiscount.objects.all()
    serializer_class = UserDiscountSerializer
    permission_classes = [IsAdminUser]
