from rest_framework import serializers
from .models import Ticket, Message

class MessageSerializer(serializers.ModelSerializer):
    # Serializer for messages within a ticket.
    class Meta:
        model = Message
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    # Serializer for tickets.
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'type', 'title', 'status', 'priority', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['user', 'created_at', 'updated_at']
