# E-commerce Shop

A comprehensive, full-featured e-commerce platform built with **Django** and **Django REST Framework** for the backend, and modern **HTML/CSS/JavaScript** for the frontend. This project provides a complete, scalable, and user-friendly solution for modern online retail.

## 🚀 Features

- **User Management**: Registration, authentication, profiles, and address management
- **Product Catalog**: Categories, products, bundles, discounts, and reviews
- **Shopping Cart**: Add/remove items, quantity management
- **Order Processing**: Complete order lifecycle from cart to delivery
- **Payment System**: Multiple payment methods with transaction tracking
- **Inventory Management**: Multi-warehouse inventory tracking
- **Vendor System**: Multi-vendor marketplace support
- **Customer Support**: Ticketing system for customer inquiries
- **Wishlist**: Save products for later purchase
- **Returns**: Complete return and refund process
- **RESTful API**: Comprehensive API for frontend integration

## 📁 Project Structure

```
├── code/              # Django backend source code
├── docs/              # Project documentation
├── frontend/          # HTML/CSS/JS frontend files
├── DBML/             # Database schema (DBML format)
├── ER/               # Entity-Relationship diagrams
└── README.md         # This file
```

## 🛠️ Technology Stack

**Backend:**
- Django 4.x
- Django REST Framework
- SQLite (development)
- JWT Authentication

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

## ⚡ Quick Start

### Prerequisites

- Python 3.13.x
- pip (Python package installer)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/MG-530/E-Commerce-shop-by-Django
cd E-Commerce-shop-by-Django
```

### 2. Backend Setup

Navigate to the code directory and set up the Django backend:

```bash
cd code
```

Create and activate a virtual environment:

```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

Create and apply database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Admin User

```bash
python manage.py createsuperuser
```

### 6. Start Backend Server

```bash
python manage.py runserver
```

The backend API will be available at: `http://127.0.0.1:8000/`

### 7. Start Frontend Server

Open a new terminal and navigate to the frontend directory:

```bash
cd ../frontend
python3 -m http.server 8080
```

The frontend will be available at: `http://localhost:8080`

## 📚 API Documentation

The complete API documentation is available in the `docs/` folder:
- [`Backend_API_Documentation.md`](docs/Backend_API_Documentation.md) - Complete API reference
- [`Model_Documentation_by_Application.md`](docs/Model_Documentation_by_Application.md) - Database models documentation

### API Base URL
All API endpoints are prefixed with `/api/`

### Authentication
Protected endpoints require JWT token authentication:
```bash
Authorization: Token <your-jwt-token>
```

Get your token by posting to `/api/users/api-token-auth/` with email and password.

### Key Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /api/users/api-token-auth/` | User authentication |
| Users | `GET /api/users/users/` | User management |
| Products | `GET /api/catalog/products/` | Product catalog |
| Cart | `GET /api/orders/carts/` | Shopping cart |
| Orders | `GET /api/orders/orders/` | Order management |
| Wishlist | `GET /api/wishlist/items/` | User wishlist |

## 🗄️ Database Schema

The project uses a modular database design with the following main modules:

- **Users**: User accounts, profiles, and addresses
- **Catalog**: Products, categories, discounts, and reviews
- **Orders**: Shopping carts, orders, payments, and shipments
- **Inventory**: Warehouses and stock management
- **Vendors**: Multi-vendor marketplace features
- **Support**: Customer service ticketing system
- **Wishlist**: User product wishlists
- **Returns**: Product return and refund management

Database schema files are available in:
- `DBML/DBML.dbml` - Database markup language file
- `ER/` - Entity-relationship diagrams

## 🔧 Development

### Adding New Features
1. Create new Django apps in the `code/` directory
2. Add models, serializers, and views
3. Update API documentation
4. Test API endpoints
5. Update frontend to consume new APIs

### Running Tests
```bash
cd code
python manage.py test
```

### Admin Panel
Access the Django admin panel at `http://127.0.0.1:8000/admin/` using your superuser credentials.

## 🌐 Deployment

This is a development setup using SQLite. For production deployment:
1. Configure a production database (PostgreSQL recommended)
2. Set up proper environment variables
3. Configure static file serving
4. Set up CORS properly for your domain
5. Use a production WSGI server (Gunicorn recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support and questions:
- Check the documentation in the `docs/` folder
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a development/testing environment. Please configure appropriate security settings before deploying to production.