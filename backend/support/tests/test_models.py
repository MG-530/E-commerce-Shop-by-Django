from django.test import TestCase
from django.contrib.auth import get_user_model
from support.models import Ticket, Message

User = get_user_model()

class TicketModelTest(TestCase):
    # Test cases for the Ticket model.
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.ticket = Ticket.objects.create(user=self.user, title='My laptop is broken', type='technical')

    def test_ticket_creation(self):
        # Test if a ticket is created correctly.
        self.assertEqual(self.ticket.title, 'My laptop is broken')
        self.assertEqual(self.ticket.user.username, 'testuser')

    def test_ticket_str(self):
        # Test the string representation.
        self.assertEqual(str(self.ticket), f'Ticket #{self.ticket.id} - My laptop is broken')
