from django.contrib import admin
from .models import ReturnRequest, ReturnItem

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = ('order', 'user', 'status', 'refund_amount')
    list_filter = ('status',)
    search_fields = ('order__Order_ID', 'user__username')

@admin.register(ReturnItem)
class ReturnItemAdmin(admin.ModelAdmin):
    list_display = ('return_request', 'order_item', 'quantity', 'status')
    list_filter = ('status',)
