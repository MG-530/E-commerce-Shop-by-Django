from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer

class UserViewSet(viewsets.ModelViewSet):
    # ViewSet for handling user data.
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AddressViewSet(viewsets.ModelViewSet):
    # ViewSet for handling user addresses.
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see their own addresses.
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate new addresses with the current user.
        serializer.save(user=self.request.user)
