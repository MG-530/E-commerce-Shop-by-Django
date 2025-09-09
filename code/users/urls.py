from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'addresses', AddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', LoginView.as_view(), name='api-token-auth'),
    path('register/', RegisterView.as_view(), name='user-register'),
]
