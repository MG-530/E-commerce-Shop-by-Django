from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ReturnRequest, ReturnItem
from .serializers import ReturnRequestSerializer, ReturnItemSerializer

class ReturnRequestViewSet(viewsets.ModelViewSet):
    # ViewSet for return requests.
    queryset = ReturnRequest.objects.all()
    serializer_class = ReturnRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own return requests.
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user for a new return request.
        serializer.save(user=self.request.user)

class ReturnItemViewSet(viewsets.ModelViewSet):
    # ViewSet for return items.
    queryset = ReturnItem.objects.all()
    serializer_class = ReturnItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see return items for their own return requests.
        return self.queryset.filter(return_request__user=self.request.user)
