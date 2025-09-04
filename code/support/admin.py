from django.contrib import admin
from .models import Ticket, Message, TicketAccess

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'status', 'priority', 'created_at')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'user__username')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'sender_user', 'date')
    search_fields = ('content', 'sender_user__username')

@admin.register(TicketAccess)
class TicketAccessAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'user', 'access_type')
    list_filter = ('access_type',)
