from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, DiscountViewSet, ProductViewSet, CommentViewSet, BundleViewSet, BundleProductViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'products', ProductViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'bundles', BundleViewSet)
router.register(r'bundle-products', BundleProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
