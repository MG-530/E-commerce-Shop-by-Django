from django.test import TestCase
from inventory.models import Warehouse, ProductInventory
from catalog.models import Product, Category

class WarehouseModelTest(TestCase):
    # Test cases for the Warehouse model.
    def setUp(self):
        self.warehouse = Warehouse.objects.create(name='Main Warehouse', location='Tehran', status='active')

    def test_warehouse_creation(self):
        # Test if a warehouse is created.
        self.assertEqual(self.warehouse.name, 'Main Warehouse')
    
    def test_warehouse_str(self):
        # Test the string representation.
        self.assertEqual(str(self.warehouse), 'Main Warehouse')
