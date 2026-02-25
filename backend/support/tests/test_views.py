from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from support.models import Ticket, Message

User = get_user_model()

class TicketAPITest(APITestCase):
    # Test cases for the Ticket API.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('ticket-list')
        self.ticket_data = {
            'user': self.user.id,
            'title': 'My issue',
            'type': 'technical',
            'status': 'open',
            'priority': 'medium'
        }

    def test_create_ticket(self):
        # Test creating a new ticket.
        response = self.client.post(self.list_url, self.ticket_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 1)
