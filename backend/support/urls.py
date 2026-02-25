from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
