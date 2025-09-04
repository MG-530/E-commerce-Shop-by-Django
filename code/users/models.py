from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # This model extends Django's default User model to allow custom fields as per DBML.
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)
    account_status = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.username

class Address(models.Model):
    # Model for user addresses.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.street}, {self.city}"
