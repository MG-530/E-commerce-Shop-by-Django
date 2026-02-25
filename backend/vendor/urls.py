from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorProductViewSet, VendorReviewViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'vendor-products', VendorProductViewSet)
router.register(r'vendor-reviews', VendorReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
