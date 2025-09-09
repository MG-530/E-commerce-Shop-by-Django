

# E-commerce Shop Backend API Documentation

## 1. Project Overview

This is a comprehensive backend system for a full-featured e-commerce shop, built with **Django** and **Django REST Framework**. The system is **modular, scalable, and maintainable**, exposing RESTful APIs for:

* User management
* Product catalog
* Shopping carts
* Orders
* Inventory
* Support tickets
* Vendors
* Wishlist
* Returns

All API endpoints are prefixed with `/api/`. Protected endpoints require a **JWT token** in the `Authorization` header. The authentication endpoint is public.

---

## 2. API Endpoints

### 2.1 Authentication

Protected endpoints use DRF Token Authentication.

**Login**
**Endpoint:** `/api/users/api-token-auth/`
**Method:** POST

Request:
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

Response:
```json
{ "token": "<token>" }
```

---

### 2.2 Users

| Endpoint                     | Method           | Description                                              |
| ---------------------------- | ---------------- | -------------------------------------------------------- |
| `/api/users/register/`       | POST             | Register a new user account                              |
| `/api/users/users/`          | GET              | Retrieve all users (admin only)                          |
| `/api/users/users/<id>/`     | GET, PUT, DELETE | Retrieve, update, or delete a specific user (admin only) |
| `/api/users/addresses/`      | GET              | Retrieve a list of user addresses                        |
| `/api/users/addresses/<id>/` | GET, PUT, DELETE | Retrieve, update, or delete a specific address           |

---

### 2.3 Catalog

| Endpoint                      | Method           | Description                                    |
| ----------------------------- | ---------------- | ---------------------------------------------- |
| `/api/catalog/products/`      | GET, POST        | List all products or create a new one          |
| `/api/catalog/products/<id>/` | GET, PUT, DELETE | Retrieve, update, or delete a specific product |
| `/api/catalog/categories/`    | GET, POST        | List all categories or create a new one        |
| `/api/catalog/discounts/`     | GET, POST        | List all discounts or create a new one         |
| `/api/catalog/comments/`      | GET, POST        | List all comments or create a new one          |
| `/api/catalog/bundles/`       | GET, POST        | List all product bundles                       |
| `/api/catalog/bundle-products/` | GET, POST      | Manage products within bundles                 |

---

### 2.4 Orders

| Endpoint                   | Method    | Description                                                |
| -------------------------- | --------- | ---------------------------------------------------------- |
| `/api/orders/carts/`       | GET       | Get or create the current user's cart (singleton)          |
| `/api/orders/cart-items/`  | GET, POST | List items in the cart or add a new item                   |
| `/api/orders/orders/`      | GET, POST | List all orders for the current user or create a new order |
| `/api/orders/orders/<id>/` | GET       | Retrieve a specific order by ID                            |
| `/api/orders/payments/`    | GET, POST | Get a list of payments or add a new payment                |
| `/api/orders/shipments/`   | GET, POST | Get a list of shipments or add a new shipment              |
| `/api/orders/purchase/create_order_from_cart/` | POST | Create an order from cart, reduce inventory, clear cart |

#### 2.4.1 Cart Item Payloads

Add to cart (POST `/api/orders/cart-items/`):
```json
{ "product_id": 123, "quantity": 2 }
```

Response item shape:
```json
{
  "id": 1,
  "cart": 10,
  "product": { "id": 123, "product_name": "Laptop", "price": 1200.0 },
  "quantity": 2,
  "total_price": 2400.0
}
```

Cart response (GET `/api/orders/carts/`):
```json
{
  "id": 10,
  "user": 5,
  "items": [ /* Cart items as above */ ],
  "total_amount": 2400.0,
  "item_count": 1
}
```

Notes:
- Re-adding the same product increments its quantity.
- All cart endpoints require `Authorization: Token <token>`.

#### 2.4.2 Purchase

POST `/api/orders/purchase/create_order_from_cart/`

Validation errors (400):
```json
{ "error": "Cart is empty." }
{ "error": "Inventory not found for <product_name>" }
{ "error": "Not enough stock for <product_name>" }
{ "error": "User has no address on file." }
```

---

### 2.5 Other Modules

#### 2.5.1 Inventory
| Endpoint                         | Method    | Description                                         |
| -------------------------------- | --------- | --------------------------------------------------- |
| `/api/inventory/warehouses/`     | GET, POST | List all warehouses or create a new one             |
| `/api/inventory/inventories/`    | GET, POST | Manage product inventory in warehouses              |
| `/api/inventory/transactions/`   | GET, POST | Track inventory movements and transactions          |

#### 2.5.2 Vendor
| Endpoint                         | Method    | Description                                         |
| -------------------------------- | --------- | --------------------------------------------------- |
| `/api/vendors/vendors/`          | GET, POST | List all vendors or create a new vendor             |
| `/api/vendors/vendor-products/`  | GET, POST | Manage vendor-product relationships                 |
| `/api/vendors/vendor-reviews/`   | GET, POST | Manage vendor reviews and ratings                   |

#### 2.5.3 Support
| Endpoint                     | Method    | Description                                         |
| ---------------------------- | --------- | --------------------------------------------------- |
| `/api/support/tickets/`      | GET, POST | List user's tickets or create a new one             |
| `/api/support/messages/`     | GET, POST | Manage messages within support tickets              |

#### 2.5.4 Wishlist
| Endpoint                     | Method    | Description                                         |
| ---------------------------- | --------- | --------------------------------------------------- |
| `/api/wishlist/items/`       | GET, POST | List items in the user's wishlist or add a new item |

#### 2.5.5 Returns
| Endpoint                     | Method    | Description                                         |
| ---------------------------- | --------- | --------------------------------------------------- |
| `/api/returns/requests/`     | GET, POST | List user's return requests or create a new one     |
| `/api/returns/items/`        | GET, POST | Manage items within return requests                 |

---

## 3. Data Models

### 3.1 User and Authentication Models

* **User:** Extends Django’s `AbstractUser` with `phone_number`, `birthday`, `account_status`
* **Address:** Stores user addresses, linked to the `User` model

### 3.2 Catalog Models

* **Product:** Core model for product information
* **Category:** Hierarchical model for organizing products
* **Discount:** Manages discount codes
* **Comment:** User reviews and comments on products
* **Bundle:** Groups products into a single unit
* **BundleProduct:** Links products to bundles with quantities

### 3.3 Orders Models

* **Cart:** Represents a user's shopping cart
* **CartItem:** Items and quantity within a cart
* **Order:** A completed transaction, linked to user and address
* **OrderItem:** Products and quantities in a specific order
* **Payment:** Tracks payment details for an order
* **Shipment:** Manages shipping information and status

### 3.4 Other Models

* **Warehouse:** Stores physical locations for inventory
* **ProductInventory:** Manages product quantities in warehouses
* **InventoryTransaction:** Tracks movement of products between warehouses
* **Ticket:** User support tickets
* **Message:** Messages exchanged within a ticket
* **Vendor:** Manages vendors and their details
* **Wishlist:** Tracks products a user is interested in
* **ReturnRequest:** Manages return requests from users
* **ReturnItem:** Items and quantity in a return request

---

## 4. How to Run the Backend

1. **Install dependencies:**

```bash
pip install Django djangorestframework
```

2. **Create and apply migrations:**

```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Create a superuser:**

```bash
python manage.py createsuperuser
```

4. **Run the server:**

```bash
python manage.py runserver
```

* Backend URL: `http://127.0.0.1:8000/`

