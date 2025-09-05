# E-commerce Shop Backend Documentation

## 1. Project Overview

This backend system is a **modular, scalable, and multi-functional platform** for an e-commerce shop, built with **Django** and **Django REST Framework**. Each module (app) handles specific business logic and exposes **RESTful APIs** for frontend integration.

---

## 2. Model Documentation by Application

### 2.1 Users

Manages all user-related data, including authentication and user profiles.

**Models:**

* **User**: Central user model extending Django's `AbstractUser`.
  **Fields:** `username`, `email`, `password`, `first_name`, `last_name`, `phone_number`, `birthday`, `account_status`

* **Address**: Stores user addresses.
  **Fields:** `user` (FK → User), `street`, `city`, `state`, `zip_code`

---

### 2.2 Catalog

Manages products, categories, discounts, and promotional items.

**Models:**

* **Category**: Organizes products hierarchically.
  **Fields:** `name`, `description`, `parent_category` (FK → Category)

* **Discount**: Manages discounts (percentage or fixed).
  **Fields:** `value`, `discount_type`, `start_date`, `end_date`, `description`

* **Product**: Represents a product for sale.
  **Fields:** `sku`, `product_name`, `description`, `price`, `weight`, `dimensions`, `status`, `category` (FK → Category), `discount` (FK → Discount)

* **Comment**: User reviews and ratings for products.
  **Fields:** `product` (FK → Product), `user` (FK → User), `text`, `star`, `likes_count`, `dislikes_count`, `reply_comment` (FK → Comment)

* **Bundle**: Collection of products sold as a single package.
  **Fields:** `name`, `description`, `status`

* **BundleProduct**: Links products to bundles.
  **Fields:** `bundle` (FK → Bundle), `product` (FK → Product), `quantity`, `price_adjustment`

* **UserDiscount**: Applies specific discounts to individual users.
  **Fields:** `user` (FK → User), `discount` (FK → Discount)

---

### 2.3 Orders

Handles the complete order lifecycle from cart to payment and shipment.

**Models:**

* **Cart**: Represents a user's shopping cart.
  **Fields:** `user` (FK → User)

* **CartItem**: Links products to a cart.
  **Fields:** `cart` (FK → Cart), `product` (FK → Product), `quantity`

* **Order**: Represents a completed transaction.
  **Fields:** `user` (FK → User), `order_date`, `total_price`, `status`, `address` (FK → Address), `discount` (FK → Discount)

* **OrderItem**: Items within an order.
  **Fields:** `order` (FK → Order), `product` (FK → Product), `quantity`, `price`

* **Payment**: Tracks order payment details.
  **Fields:** `order` (FK → Order), `payment_date`, `payment_method`, `transaction_id`, `amount`

* **Shipment**: Tracks order delivery.
  **Fields:** `order` (FK → Order), `shipment_date`, `carrier`, `tracking_number`, `status`

---

### 2.4 Inventory

Manages warehouses and product inventory.

**Models:**

* **Warehouse**: Stores warehouse information.
  **Fields:** `Warehouse_ID` (PK), `Name`, `Location`, `status`

* **ProductInventory**: Tracks product quantity per warehouse.
  **Fields:** `product` (FK → Product), `warehouse` (FK → Warehouse), `Quantity`, `Minimum_Quantity`, `Maximum_Quantity`, `Last_Updated`, `status`

* **InventoryTransaction**: Records inventory movements (inbound/outbound/transfers).
  **Fields:** `Transaction_ID` (PK), `product` (FK → Product), `warehouse` (FK → Warehouse), `Quantity`, `Type`, `Reference_Type`, `Reference_ID`, `timestamp`

---

### 2.5 Vendor

Manages third-party vendors and their products.

**Models:**

* **Vendor**: Represents a seller.
  **Fields:** `Vendor_ID` (PK, FK → User), `Shop_Name`, `Description`, `Rating`, `status`

* **VendorProduct**: Links products to vendors.
  **Fields:** `Vendor_ID` (PK, FK → Vendor), `Product_ID` (PK, FK → Product)

* **VendorReview**: User reviews for vendors.
  **Fields:** `Review_ID` (PK), `Vendor` (FK → Vendor), `User` (FK → User), `Rating`, `Comment`

---

### 2.6 Support

Provides a ticketing system for customer support.

**Models:**

* **Ticket**: Manages support requests.
  **Fields:** `user` (FK → User), `type`, `title`, `status`, `priority`, `created_at`, `updated_at`

* **Message**: Records messages in a ticket.
  **Fields:** `ticket` (FK → Ticket), `sender_user` (FK → User), `content`, `date`

* **TicketAccess**: Manages ticket permissions.
  **Fields:** `ticket` (FK → Ticket), `user` (FK → User), `access_type`

---

### 2.7 Wishlist

Manages user wishlists.

**Models:**

* **Wishlist**: Represents a user's wishlist.
  **Fields:** `user` (FK → User)

* **WishlistItem**: Links products to a wishlist.
  **Fields:** `wishlist` (FK → Wishlist), `product` (FK → Product)

---

### 2.8 Return

Handles product return processes.

**Models:**

* **ReturnRequest**: Initiates a return request.
  **Fields:** `order` (FK → Order), `user` (FK → User), `status`, `Reason`, `Refund_amount`, `Tracking_Number`, `shipment_status`

* **ReturnItem**: Specifies items being returned.
  **Fields:** `Return_ID` (PK, FK → ReturnRequest), `Order_Item_ID` (PK, FK → OrderItem), `Quantity`, `status`, `Price_adjustment`, `Description`


