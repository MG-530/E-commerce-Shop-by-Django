"""
URL configuration for shop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/users/', include('users.urls')),
    path('api/catalog/', include('catalog.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/support/', include('support.urls')),
    path('api/vendors/', include('vendor.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/returns/', include('return.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('product-detail/', TemplateView.as_view(template_name='product_detail.html'), name='product_detail'),
    path('cart/', TemplateView.as_view(template_name='cart.html'), name='cart'),
    path('admin-panel/', TemplateView.as_view(template_name='admin_panel.html'), name='admin_panel'),
    path('login/', TemplateView.as_view(template_name='login.html'), name='login'),
]
