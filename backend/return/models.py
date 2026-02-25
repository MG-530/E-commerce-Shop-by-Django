from django.db import models
from django.conf import settings
from orders.models import Order, OrderItem

class ReturnRequest(models.Model):
    # A request for returning an item.
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='return_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    reason = models.TextField()
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tracking_number = models.CharField(max_length=255, null=True, blank=True)
    shipment_status = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Return request for Order #{self.order.Order_ID}"

class ReturnItem(models.Model):
    # Items within a return request.
    return_request = models.ForeignKey(ReturnRequest, on_delete=models.CASCADE, related_name='items')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    status = models.CharField(max_length=50)
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField()

    def __str__(self):
        return f"Return item for request #{self.return_request.id}"
