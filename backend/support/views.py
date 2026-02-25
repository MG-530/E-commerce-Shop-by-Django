from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket, Message
from .serializers import TicketSerializer, MessageSerializer

class TicketViewSet(viewsets.ModelViewSet):
    # ViewSet for support tickets.
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see tickets they own.
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user for a new ticket.
        serializer.save(user=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    # ViewSet for messages within a ticket.
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see messages for their own tickets.
        return self.queryset.filter(ticket__user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the sender for a new message.
        serializer.save(sender_user=self.request.user)
