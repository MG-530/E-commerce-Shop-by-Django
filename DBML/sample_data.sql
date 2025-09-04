

-- Insert Users
INSERT INTO User (User_ID, email, password, first_name, last_name, phone_number, role, account_status, birthday) VALUES
(1, 'admin@shop.com', 'admin123', 'احمد', 'محمدی', '09121234567', 'admin', 'active', '1985-03-15'),
(2, 'sara.ahmadi@email.com', 'pass123', 'سارا', 'احمدی', '09129876543', 'customer', 'active', '1990-07-22'),
(3, 'ali.rezaei@email.com', 'mypass456', 'علی', 'رضایی', '09123456789', 'customer', 'active', '1988-12-10'),
(4, 'vendor1@shop.com', 'vendor123', 'فاطمه', 'کریمی', '09121111111', 'vendor', 'active', '1982-05-30'),
(5, 'mehdi.safari@email.com', 'password789', 'مهدی', 'صفری', '09122222222', 'customer', 'active', '1995-09-18'),
(6, 'maryam.hosseini@email.com', 'secure123', 'مریم', 'حسینی', '09123333333', 'customer', 'active', '1992-11-05'),
(7, 'vendor2@shop.com', 'vendor456', 'حسن', 'نوری', '09124444444', 'vendor', 'active', '1980-02-14'),
(8, 'support@shop.com', 'support123', 'پشتیبانی', 'فروشگاه', '09125555555', 'support', 'active', '1990-01-01');

-- Insert Addresses
INSERT INTO Address (Address_ID, User_ID, street, city, state, zip_code) VALUES
(1, 2, 'خیابان ولیعصر، پلاک 123', 'تهران', 'تهران', '1234567890'),
(2, 3, 'خیابان انقلاب، کوچه سوم، پلاک 45', 'تهران', 'تهران', '1345678901'),
(3, 4, 'خیابان فردوسی، پلاک 67', 'اصفهان', 'اصفهان', '2345678901'),
(4, 5, 'خیابان شیراز، پلاک 89', 'شیراز', 'فارس', '3456789012'),
(5, 6, 'خیابان باهنر، پلاک 101', 'کرج', 'البرز', '4567890123'),
(6, 7, 'خیابان امام، پلاک 234', 'مشهد', 'خراسان رضوی', '5678901234');

-- Insert Categories
INSERT INTO Category (Category_ID, name, description, parent_category_id) VALUES
(1, 'الکترونیک', 'محصولات الکترونیکی', NULL),
(2, 'پوشاک', 'لباس و کفش', NULL),
(3, 'کتاب', 'کتاب و نشریات', NULL),
(4, 'گوشی موبایل', 'تلفن همراه و لوازم جانبی', 1),
(5, 'لپ تاپ', 'کامپیوتر قابل حمل', 1),
(6, 'لباس مردانه', 'پوشاک آقایان', 2),
(7, 'لباس زنانه', 'پوشاک بانوان', 2),
(8, 'کتاب ادبی', 'رمان و شعر', 3),
(9, 'کتاب علمی', 'کتاب های علمی و تخصصی', 3);

-- Insert Discounts
INSERT INTO Discount (Discount_ID, value, discount_type, start_date, end_date, description) VALUES
(1, 10.00, 'percentage', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'تخفیف 10 درصدی عمومی'),
(2, 50000.00, 'fixed', '2024-06-01 00:00:00', '2024-06-30 23:59:59', 'تخفیف 50 هزار تومانی ویژه'),
(3, 15.00, 'percentage', '2024-03-01 00:00:00', '2024-03-31 23:59:59', 'تخفیف بهاری 15 درصد'),
(4, 100000.00, 'fixed', '2024-11-01 00:00:00', '2024-11-30 23:59:59', 'تخفیف جمعه سیاه');

-- Insert Products
INSERT INTO Product (Product_ID, SKU, product_name, description, price, weight, dimensions, status, category_id, Discount_ID) VALUES
(1, 'IPHONE15-128', 'آیفون 15 - 128 گیگ', 'گوشی آیفون 15 با حافظه 128 گیگابایت', 45000000.00, 0.171, '14.76x7.15x0.78 cm', 'active', 4, 1),
(2, 'SAMSUNG-A54', 'سامسونگ گلکسی A54', 'گوشی سامسونگ A54 با دوربین 50 مگاپیکسل', 15000000.00, 0.202, '15.86x7.66x0.82 cm', 'active', 4, NULL),
(3, 'LAPTOP-ASUS-X515', 'لپ تاپ ایسوس X515', 'لپ تاپ ایسوس با پردازنده i5', 25000000.00, 1.8, '35.98x23.57x1.99 cm', 'active', 5, 2),
(4, 'TSHIRT-NIKE-001', 'تی شرت نایک', 'تی شرت ورزشی نایک سایز L', 850000.00, 0.2, '70x50x2 cm', 'active', 6, NULL),
(5, 'BOOK-HAFEZ', 'دیوان حافظ', 'مجموعه اشعار حافظ شیرازی', 120000.00, 0.5, '24x17x3 cm', 'active', 8, 3),
(6, 'DRESS-ZARA-002', 'پیراهن زارا', 'پیراهن زنانه زارا رنگ آبی', 1200000.00, 0.3, '60x40x2 cm', 'active', 7, NULL),
(7, 'HEADPHONE-SONY', 'هدفون سونی', 'هدفون بی سیم سونی با کیفیت بالا', 3500000.00, 0.25, '18x16x8 cm', 'active', 1, 1),
(8, 'BOOK-PHYSICS', 'فیزیک عمومی', 'کتاب فیزیک عمومی هالیدی', 450000.00, 1.2, '26x20x4 cm', 'active', 9, NULL),
(9, 'WATCH-APPLE', 'اپل واچ سری 9', 'ساعت هوشمند اپل نسل جدید', 18000000.00, 0.038, '4.5x3.8x1.05 cm', 'active', 1, 4),
(10, 'JEANS-LEVIS', 'شلوار جین لیوایز', 'شلوار جین مردانه لیوایز سایز 32', 950000.00, 0.6, '75x35x2 cm', 'active', 6, NULL);

-- Insert Warehouses
INSERT INTO Warehouse (Warehouse_ID, Name, Location, status) VALUES
(1, 'انبار تهران مرکزی', 'تهران، شهرک صنعتی', 'active'),
(2, 'انبار اصفهان', 'اصفهان، شهرک صنعتی', 'active'),
(3, 'انبار شیراز', 'شیراز، ناحیه صنعتی', 'active');

-- Insert Product Inventory
INSERT INTO Product_Inventory (Product_ID, Warehouse_ID, Quantity, Minimum_Quantity, Maximum_Quantity, Last_Updated, status) VALUES
(1, 1, 50, 10, 200, '2024-06-01 10:00:00', 'active'),
(2, 1, 75, 15, 300, '2024-06-01 10:00:00', 'active'),
(3, 1, 25, 5, 100, '2024-06-01 10:00:00', 'active'),
(1, 2, 30, 10, 150, '2024-06-01 10:00:00', 'active'),
(4, 1, 100, 20, 500, '2024-06-01 10:00:00', 'active'),
(5, 1, 200, 50, 1000, '2024-06-01 10:00:00', 'active'),
(6, 1, 80, 15, 300, '2024-06-01 10:00:00', 'active'),
(7, 2, 40, 10, 200, '2024-06-01 10:00:00', 'active'),
(8, 1, 150, 30, 600, '2024-06-01 10:00:00', 'active'),
(9, 1, 35, 5, 150, '2024-06-01 10:00:00', 'active'),
(10, 1, 120, 25, 400, '2024-06-01 10:00:00', 'active');

-- Insert Carts
INSERT INTO Cart (Cart_ID, User_ID) VALUES
(1, 2),
(2, 3),
(3, 5),
(4, 6);

-- Insert Cart Items
INSERT INTO Cart_Item (Cart_Item_ID, Cart_ID, Product_ID, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 5, 2),
(3, 2, 3, 1),
(4, 3, 4, 3),
(5, 4, 6, 1),
(6, 4, 7, 1);

-- Insert Wishlists
INSERT INTO Wishlist (Wishlist_ID, User_ID) VALUES
(1, 2),
(2, 3),
(3, 5);

-- Insert Wishlist Items
INSERT INTO Wishlist_Item (Wishlist_Item_ID, Wishlist_ID, Product_ID) VALUES
(1, 1, 9),
(2, 1, 7),
(3, 2, 1),
(4, 3, 8),
(5, 3, 10);

-- Insert Orders
INSERT INTO `Order` (Order_ID, User_ID, order_date, total_price, status, Address_ID, Discount_ID) VALUES
(1, 2, '2024-05-15 14:30:00', 40500000.00, 'completed', 1, 1),
(2, 3, '2024-05-20 09:15:00', 24750000.00, 'shipped', 2, 2),
(3, 5, '2024-05-25 16:45:00', 2550000.00, 'processing', 4, NULL),
(4, 6, '2024-06-01 11:20:00', 1200000.00, 'pending', 5, NULL),
(5, 2, '2024-06-03 13:10:00', 3150000.00, 'completed', 1, 1);

-- Insert Order Items
INSERT INTO Order_Item (Order_Item_ID, Order_ID, Product_ID, quantity, price) VALUES
(1, 1, 1, 1, 45000000.00),
(2, 2, 3, 1, 25000000.00),
(3, 3, 4, 3, 850000.00),
(4, 4, 6, 1, 1200000.00),
(5, 5, 7, 1, 3500000.00),
(6, 1, 5, 2, 120000.00);

-- Insert Payments
INSERT INTO Payment (Payment_ID, Order_ID, payment_date, payment_method, transaction_id, amount) VALUES
(1, 1, '2024-05-15 14:35:00', 'credit_card', 'TXN001234567', 40500000.00),
(2, 2, '2024-05-20 09:20:00', 'online_banking', 'TXN007654321', 24750000.00),
(3, 5, '2024-06-03 13:15:00', 'wallet', 'TXN009876543', 3150000.00);

-- Insert Shipments
INSERT INTO Shipment (Shipment_ID, Order_ID, shipment_date, carrier, tracking_number, status, Shipment_Address_ID) VALUES
(1, 1, '2024-05-16 10:00:00', 'پست پیشتاز', 'POST123456789', 'delivered', 1),
(2, 2, '2024-05-21 08:30:00', 'تیپاکس', 'TIPAX987654321', 'in_transit', 2),
(3, 5, '2024-06-04 14:00:00', 'پیک موتوری', 'BIKE001122334', 'delivered', 1);

-- Insert User Discounts
INSERT INTO User_Discount (User_ID, Discount_ID) VALUES
(2, 1),
(3, 2),
(5, 3),
(6, 1);

-- Insert Comments/Reviews
INSERT INTO Comment (Comment_ID, Product_ID, User_ID, text, star, likes_count, dislikes_count, reply_comment_ID) VALUES
(1, 1, 2, 'محصول فوق العاده و کیفیت عالی. پیشنهاد می کنم', 5, 12, 1, NULL),
(2, 3, 3, 'لپ تاپ خوبی با قیمت مناسب. راضی هستم', 4, 8, 0, NULL),
(3, 4, 5, 'تی شرت خیلی راحت و با کیفیت', 5, 5, 0, NULL),
(4, 1, 3, 'من هم موافقم، آیفون 15 واقعا عالیه', 5, 3, 0, 1),
(5, 7, 6, 'صدای هدفون بسیار واضح و با کیفیت', 4, 7, 1, NULL),
(6, 5, 2, 'دیوان حافظ زیبا و مرتب چاپ شده', 5, 15, 0, NULL);

-- Insert Vendors
INSERT INTO Vendor (Vendor_ID, Shop_Name, Description, Rating, status) VALUES
(4, 'فروشگاه دیجیکالا', 'فروشگاه آنلاین محصولات الکترونیک', 4.5, 'active'),
(7, 'بازار کتاب', 'فروشگاه تخصصی کتاب و نشریات', 4.2, 'active');

-- Insert Vendor Products
INSERT INTO Vendor_Product (Vendor_ID, Product_ID) VALUES
(4, 1),
(4, 2),
(4, 3),
(4, 7),
(4, 9),
(7, 5),
(7, 8);

-- Insert Vendor Reviews
INSERT INTO Vendor_Review (Review_ID, Vendor_ID, User_ID, Rating, Comment) VALUES
(1, 4, 2, 4.5, 'فروشگاه معتبر با ارسال سریع'),
(2, 4, 3, 4.0, 'کیفیت محصولات خوب اما قیمت کمی بالا'),
(3, 7, 5, 5.0, 'بهترین فروشگاه کتاب، تنوع بالا'),
(4, 7, 6, 4.0, 'کتاب های با کیفیت و بسته بندی مناسب');

-- Insert Support Tickets
INSERT INTO Ticket (Ticket_ID, User_ID, type, title, status, priority, created_at) VALUES
(1, 2, 'technical', 'مشکل در پرداخت', 'closed', 'high', '2024-05-10 09:00:00'),
(2, 3, 'order', 'تاخیر در ارسال سفارش', 'open', 'medium', '2024-05-22 14:30:00'),
(3, 5, 'product', 'سوال درباره گارانتی', 'open', 'low', '2024-06-01 16:15:00'),
(4, 6, 'account', 'تغییر اطلاعات حساب کاربری', 'closed', 'medium', '2024-05-28 11:45:00');

-- Insert Messages
INSERT INTO Message (Message_ID, Ticket_ID, Sender_User_ID, content, date) VALUES
(1, 1, 2, 'سلام، مشکلی در پرداخت سفارشم دارم', '2024-05-10 09:05:00'),
(2, 1, 8, 'سلام، مشکل شما بررسی و برطرف شد', '2024-05-10 10:30:00'),
(3, 2, 3, 'سفارشم دیر رسیده، چه زمانی ارسال می شود؟', '2024-05-22 14:35:00'),
(4, 3, 5, 'گارانتی محصولات چقدر است؟', '2024-06-01 16:20:00'),
(5, 4, 6, 'می خواهم شماره تلفنم را تغییر دهم', '2024-05-28 11:50:00'),
(6, 4, 8, 'اطلاعات شما با موفقیت تغییر یافت', '2024-05-28 13:15:00');

-- Insert Ticket Access
INSERT INTO Ticket_Access (Ticket_ID, User_ID, access_type) VALUES
(1, 2, 'write'),
(1, 8, 'admin'),
(2, 3, 'write'),
(2, 8, 'admin'),
(3, 5, 'write'),
(3, 8, 'admin'),
(4, 6, 'write'),
(4, 8, 'admin');

-- Insert Bundles
INSERT INTO Bundle (Bundle_ID, Name, Description, status) VALUES
(1, 'پکیج دانشجویی', 'لپ تاپ + هدفون مخصوص دانشجویان', 'active'),
(2, 'پکیج کتابخوان', 'مجموعه کتاب های ادبی', 'active'),
(3, 'پکیج ورزشی', 'لباس و لوازم ورزشی', 'active');

-- Insert Bundle Products
INSERT INTO Bundle_Product (Bundle_ID, Product_ID, Quantity, Price_adjustment) VALUES
(1, 3, 1, -500000.00),
(1, 7, 1, -200000.00),
(2, 5, 1, -20000.00),
(2, 8, 1, -50000.00),
(3, 4, 2, -100000.00);

-- Insert Inventory Transactions
INSERT INTO Inventory_Transaction (Transaction_ID, Product_ID, Warehouse_ID, Quantity, Type, Reference_Type, Reference_ID) VALUES
(1, 1, 1, -1, 'sale', 'order', 1),
(2, 3, 1, -1, 'sale', 'order', 2),
(3, 4, 1, -3, 'sale', 'order', 3),
(4, 6, 1, -1, 'sale', 'order', 4),
(5, 7, 2, -1, 'sale', 'order', 5),
(6, 1, 1, 10, 'restock', 'purchase', 101),
(7, 2, 1, 25, 'restock', 'purchase', 102),
(8, 5, 1, 50, 'restock', 'purchase', 103);

-- Insert Return Requests
INSERT INTO Return_Request (Return_ID, Order_ID, User_ID, status, Reason, Refund_amount, Tracking_Number, shipment_status) VALUES
(1, 3, 5, 'approved', 'سایز مناسب نبود', 850000.00, 'RET123456', 'returned'),
(2, 1, 2, 'pending', 'نقص فنی در محصول', 120000.00, NULL, 'processing');

-- Insert Return Items
INSERT INTO Return_Item (Return_ID, Order_Item_ID, Quantity, status, Price_adjustment, Description) VALUES
(1, 3, 1, 'approved', 0.00, 'تی شرت سایز L به جای M'),
(2, 6, 1, 'pending', 0.00, 'کتاب دارای نقص چاپ');

