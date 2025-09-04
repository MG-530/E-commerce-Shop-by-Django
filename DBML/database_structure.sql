-- E-Commerce Database Structure
-- Created for Phase 2 submission

-- Users and Authentication
CREATE TABLE User (
    User_ID INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    account_status VARCHAR(50) DEFAULT 'active',
    birthday DATE
);

CREATE TABLE Address (
    Address_ID INT PRIMARY KEY,
    User_ID INT,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Products and Categories
CREATE TABLE Category (
    Category_ID INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT,
    FOREIGN KEY (parent_category_id) REFERENCES Category(Category_ID)
);

CREATE TABLE Discount (
    Discount_ID INT PRIMARY KEY,
    value DECIMAL(10,2),
    discount_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    description TEXT
);

CREATE TABLE Product (
    Product_ID INT PRIMARY KEY,
    SKU VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    category_id INT,
    Discount_ID INT,
    FOREIGN KEY (category_id) REFERENCES Category(Category_ID),
    FOREIGN KEY (Discount_ID) REFERENCES Discount(Discount_ID)
);

-- Inventory Management
CREATE TABLE Warehouse (
    Warehouse_ID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE Product_Inventory (
    Product_ID INT,
    Warehouse_ID INT,
    Quantity INT DEFAULT 0,
    Minimum_Quantity INT DEFAULT 0,
    Maximum_Quantity INT DEFAULT 1000,
    Last_Updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    PRIMARY KEY (Product_ID, Warehouse_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouse(Warehouse_ID)
);

CREATE TABLE Inventory_Transaction (
    Transaction_ID INT PRIMARY KEY,
    Product_ID INT,
    Warehouse_ID INT,
    Quantity INT,
    Type VARCHAR(50),
    Reference_Type VARCHAR(50),
    Reference_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouse(Warehouse_ID)
);

-- Shopping Cart
CREATE TABLE Cart (
    Cart_ID INT PRIMARY KEY,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Cart_Item (
    Cart_Item_ID INT PRIMARY KEY,
    Cart_ID INT,
    Product_ID INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

-- Wishlist
CREATE TABLE Wishlist (
    Wishlist_ID INT PRIMARY KEY,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Wishlist_Item (
    Wishlist_Item_ID INT PRIMARY KEY,
    Wishlist_ID INT,
    Product_ID INT,
    FOREIGN KEY (Wishlist_ID) REFERENCES Wishlist(Wishlist_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

-- Orders
CREATE TABLE `Order` (
    Order_ID INT PRIMARY KEY,
    User_ID INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    Address_ID INT,
    Discount_ID INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID),
    FOREIGN KEY (Discount_ID) REFERENCES Discount(Discount_ID)
);

CREATE TABLE Order_Item (
    Order_Item_ID INT PRIMARY KEY,
    Order_ID INT,
    Product_ID INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (Order_ID) REFERENCES `Order`(Order_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

-- Shipment
CREATE TABLE Shipment (
    Shipment_ID INT PRIMARY KEY,
    Order_ID INT,
    shipment_date TIMESTAMP,
    carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    status VARCHAR(50),
    Shipment_Address_ID INT,
    FOREIGN KEY (Order_ID) REFERENCES `Order`(Order_ID),
    FOREIGN KEY (Shipment_Address_ID) REFERENCES Address(Address_ID)
);

-- Payment
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY,
    Order_ID INT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    amount DECIMAL(10,2),
    FOREIGN KEY (Order_ID) REFERENCES `Order`(Order_ID)
);

-- User Discounts
CREATE TABLE User_Discount (
    User_ID INT,
    Discount_ID INT,
    PRIMARY KEY (User_ID, Discount_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Discount_ID) REFERENCES Discount(Discount_ID)
);

-- Product Reviews and Comments
CREATE TABLE Comment (
    Comment_ID INT PRIMARY KEY,
    Product_ID INT,
    User_ID INT,
    text TEXT,
    star INT CHECK (star >= 1 AND star <= 5),
    likes_count INT DEFAULT 0,
    dislikes_count INT DEFAULT 0,
    reply_comment_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (reply_comment_ID) REFERENCES Comment(Comment_ID)
);

-- Returns
CREATE TABLE Return_Request (
    Return_ID INT PRIMARY KEY,
    Order_ID INT,
    User_ID INT,
    status VARCHAR(50),
    Reason TEXT,
    Refund_amount DECIMAL(10,2),
    Tracking_Number VARCHAR(100),
    shipment_status VARCHAR(50),
    FOREIGN KEY (Order_ID) REFERENCES `Order`(Order_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Return_Item (
    Return_ID INT,
    Order_Item_ID INT,
    Quantity INT,
    status VARCHAR(50),
    Price_adjustment DECIMAL(10,2),
    Description TEXT,
    PRIMARY KEY (Return_ID, Order_Item_ID),
    FOREIGN KEY (Return_ID) REFERENCES Return_Request(Return_ID),
    FOREIGN KEY (Order_Item_ID) REFERENCES Order_Item(Order_Item_ID)
);

-- Bundles
CREATE TABLE Bundle (
    Bundle_ID INT PRIMARY KEY,
    Name VARCHAR(255),
    Description TEXT,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE Bundle_Product (
    Bundle_ID INT,
    Product_ID INT,
    Quantity INT DEFAULT 1,
    Price_adjustment DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (Bundle_ID, Product_ID),
    FOREIGN KEY (Bundle_ID) REFERENCES Bundle(Bundle_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

-- Vendor
CREATE TABLE Vendor (
    Vendor_ID INT PRIMARY KEY,
    Shop_Name VARCHAR(255),
    Description TEXT,
    Rating DECIMAL(3,2),
    status VARCHAR(50) DEFAULT 'active',
    FOREIGN KEY (Vendor_ID) REFERENCES User(User_ID)
);

CREATE TABLE Vendor_Product (
    Vendor_ID INT,
    Product_ID INT,
    PRIMARY KEY (Vendor_ID, Product_ID),
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Vendor_Review (
    Review_ID INT PRIMARY KEY,
    Vendor_ID INT,
    User_ID INT,
    Rating DECIMAL(3,2),
    Comment TEXT,
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Support Tickets
CREATE TABLE Ticket (
    Ticket_ID INT PRIMARY KEY,
    User_ID INT,
    type VARCHAR(50),
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Message (
    Message_ID INT PRIMARY KEY,
    Ticket_ID INT,
    Sender_User_ID INT,
    content TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID),
    FOREIGN KEY (Sender_User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Ticket_Access (
    Ticket_ID INT,
    User_ID INT,
    access_type VARCHAR(50),
    PRIMARY KEY (Ticket_ID, User_ID),
    FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);