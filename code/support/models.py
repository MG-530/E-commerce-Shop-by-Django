from django.db import models
from django.conf import settings

class Ticket(models.Model):
    # Model for support tickets.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id}: {self.title}"

class Message(models.Model):
    # Messages within a ticket.
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender_user.username} on ticket {self.ticket.id}"

class TicketAccess(models.Model):
    # Defines which users have access to which tickets.
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    access_type = models.CharField(max_length=50)

    class Meta:
        unique_together = ('ticket', 'user')

    def __str__(self):
        return f"{self.user.username} access to ticket {self.ticket.id}"
