from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Custom UserAdmin to include new fields.
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'birthday', 'role', 'account_status')}),
    )

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'street', 'city', 'state', 'zip_code')
    search_fields = ('user__username', 'city', 'state')
