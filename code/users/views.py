from rest_framework import viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework import serializers
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

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get or update current user's profile.
        """
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """
        Change user password.
        """
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response(
                {'error': 'Both current_password and new_password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

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


