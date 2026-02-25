from rest_framework import serializers
from .models import Wishlist, WishlistItem

class WishlistItemSerializer(serializers.ModelSerializer):
    # Serializer for wishlist items.
    class Meta:
        model = WishlistItem
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    # Serializer for the wishlist.
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'items']
        read_only_fields = ['user']
