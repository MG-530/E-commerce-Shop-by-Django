from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReturnRequestViewSet, ReturnItemViewSet

router = DefaultRouter()
router.register(r'requests', ReturnRequestViewSet)
router.register(r'items', ReturnItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
