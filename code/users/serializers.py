from rest_framework import serializers
from .models import User, Address

class UserSerializer(serializers.ModelSerializer):
    # Serializer for the User model.
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'birthday', 'role', 'account_status']
        read_only_fields = ['role', 'account_status']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class AddressSerializer(serializers.ModelSerializer):
    # Serializer for the Address model.
    class Meta:
        model = Address
        fields = ['id', 'user', 'street', 'city', 'state', 'zip_code']
