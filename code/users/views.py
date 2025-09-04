from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer, AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken

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

class LoginView(ObtainAuthToken):
    """
    A custom view to handle user authentication and return an auth token.
    Uses the custom AuthTokenSerializer to validate login with email instead of username.
    """
    serializer_class = AuthTokenSerializer
