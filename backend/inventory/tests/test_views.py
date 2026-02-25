from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from inventory.models import Warehouse, ProductInventory

class WarehouseAPITest(APITestCase):
    # Test cases for the Warehouse API.
    def setUp(self):
        self.list_url = reverse('warehouse-list')
        self.warehouse = Warehouse.objects.create(name='Main Warehouse', location='Tehran', status='active')
    
    def test_list_warehouses(self):
        # Test retrieving a list of warehouses.
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
