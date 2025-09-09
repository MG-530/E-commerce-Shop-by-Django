from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('me/', UserViewSet.as_view({'get': 'me', 'patch': 'me'}), name='user-me'),
    path('change-password/', UserViewSet.as_view({'post': 'change_password'}), name='user-change-password'),
    path('api-token-auth/', LoginView.as_view(), name='api-token-auth'),
    path('register/', RegisterView.as_view(), name='user-register'),
]
