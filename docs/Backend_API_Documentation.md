

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

**Endpoint:** `/api/users/api-token-auth/`
**Method:** POST
**Description:** Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response Body:**

```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

---

### 2.2 Users

| Endpoint                     | Method           | Description                                              |
| ---------------------------- | ---------------- | -------------------------------------------------------- |
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

---

### 2.4 Orders

| Endpoint                   | Method    | Description                                                |
| -------------------------- | --------- | ---------------------------------------------------------- |
| `/api/orders/carts/`       | GET, POST | Get the current user's cart or create a new one            |
| `/api/orders/cart-items/`  | GET, POST | List all items in the cart or add a new item               |
| `/api/orders/orders/`      | GET, POST | List all orders for the current user or create a new order |
| `/api/orders/orders/<id>/` | GET       | Retrieve a specific order by ID                            |
| `/api/orders/payments/`    | GET, POST | Get a list of payments or add a new payment                |
| `/api/orders/shipments/`   | GET, POST | Get a list of shipments or add a new shipment              |

---

### 2.5 Other Modules

| Endpoint                     | Method    | Description                                         |
| ---------------------------- | --------- | --------------------------------------------------- |
| `/api/inventory/warehouses/` | GET, POST | List all warehouses or create a new one             |
| `/api/support/tickets/`      | GET, POST | List user's tickets or create a new one             |
| `/api/vendors/vendors/`      | GET       | List all vendors                                    |
| `/api/wishlist/items/`       | GET, POST | List items in the user's wishlist or add a new item |
| `/api/returns/requests/`     | GET, POST | List user's return requests or create a new one     |

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

