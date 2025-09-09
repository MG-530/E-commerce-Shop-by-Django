from rest_framework import viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer, AuthTokenSerializer, RegisterSerializer
from .permissions import IsOwnerOrAdmin, IsAddressOwner
from django.contrib.auth import get_user_model

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        Regular users can only see their own profile.
        Admin users can see all users.
        """
        if self.request.user.is_staff:
            return User.objects.all().order_by("-date_joined")
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get current user's profile.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class AddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user addresses to be viewed or edited.
    """
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, IsAddressOwner]

    def get_queryset(self):
        """
        Filter addresses to only show the current user's addresses.
        """
        # If explicitly requested, always return only current user's addresses
        mine = self.request.query_params.get('mine')
        if mine is not None:
            return Address.objects.filter(user=self.request.user)
        if self.request.user.is_staff:
            return Address.objects.all()
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Set the user field to the current user when creating an address.
        """
        serializer.save(user=self.request.user)

class LoginView(ObtainAuthToken):
    """
    Handles user login and token authentication using email and password.
    """
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class RegisterView(generics.CreateAPIView):
    """
    Handles user registration and account creation.
    """
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer


