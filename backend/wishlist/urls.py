from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, WishlistItemViewSet

router = DefaultRouter()
router.register(r'items', WishlistItemViewSet)

urlpatterns = [
    path('', WishlistViewSet.as_view({'get': 'retrieve', 'post': 'create'}), name='my-wishlist'),
    path('', include(router.urls)),
]
