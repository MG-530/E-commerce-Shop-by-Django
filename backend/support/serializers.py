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
    subject = serializers.CharField(source='title', write_only=True)
    messages_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'type', 'title', 'subject', 'description', 'status', 'priority', 'created_at', 'updated_at', 'messages', 'messages_count']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_messages_count(self, obj):
        return obj.messages.count()
    
    def create(self, validated_data):
        # Ensure required fields have defaults if not provided
        validated_data.setdefault('type', 'general')
        validated_data.setdefault('status', 'open')
        validated_data.setdefault('priority', 'medium')
        return super().create(validated_data)
