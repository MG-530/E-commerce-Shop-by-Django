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

class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')
