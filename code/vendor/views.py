from rest_framework import viewsets
from .models import Vendor, VendorProduct, VendorReview
from .serializers import VendorSerializer, VendorProductSerializer, VendorReviewSerializer

class VendorViewSet(viewsets.ReadOnlyModelViewSet):
    # ViewSet for vendors. Read-only for public access.
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class VendorProductViewSet(viewsets.ModelViewSet):
    # ViewSet for vendor products.
    queryset = VendorProduct.objects.all()
    serializer_class = VendorProductSerializer

class VendorReviewViewSet(viewsets.ModelViewSet):
    # ViewSet for vendor reviews.
    queryset = VendorReview.objects.all()
    serializer_class = VendorReviewSerializer
