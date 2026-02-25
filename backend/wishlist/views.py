from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistItemSerializer

class WishlistViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    # ViewSet for wishlists. Users can retrieve their own wishlist or create one if it doesn't exist.
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the current user's wishlist or create it if it doesn't exist.
        wishlist, _ = self.queryset.get_or_create(user=self.request.user)
        return wishlist

    def get_queryset(self):
        # Users can only access their own wishlist.
        return self.queryset.filter(user=self.request.user)

class WishlistItemViewSet(viewsets.ModelViewSet):
    # ViewSet for wishlist items. Users can add, remove, and update items in their wishlist.
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see items in their own wishlist.
        return self.queryset.filter(wishlist__user=self.request.user)

    def perform_create(self, serializer):
        # Automatically link the item to the current user's wishlist.
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        serializer.save(wishlist=wishlist)
