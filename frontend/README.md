# E-Commerce Frontend

A responsive, user-friendly frontend for a Django REST Framework e-commerce backend built with plain HTML, CSS, and JavaScript.

## 🚀 Features

### Core Pages
- **Homepage** (`index.html`) - Product listing with search and filtering
- **Product Details** (`product.html`) - Individual product pages with add to cart
- **Shopping Cart** (`cart.html`) - Cart management with quantity updates
- **Login/Register** (`login.html`) - Authentication with tabbed interface
- **Orders** (`orders.html`) - Order history and tracking
- **Support** (`support.html`) - Help center, contact forms, and returns
- **Admin Panel** (`admin.html`) - Product and order management

### Key Features
- 📱 **Fully Responsive Design** - Works on desktop, tablet, and mobile
- 🛒 **Shopping Cart Management** - Add, remove, update quantities
- 🔐 **User Authentication** - Login, register, password reset
- 📦 **Order Management** - View orders, track shipments, request returns
- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- 🔍 **Search & Filtering** - Product search with category and price filters
- 📞 **Customer Support** - Comprehensive help center and contact forms
- ⚡ **Fast Loading** - Optimized CSS and JavaScript

## 🛠 Tech Stack

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Fetch API** - RESTful API communication
- **LocalStorage** - Client-side data persistence

## 📁 Project Structure

```
ecommerce-frontend/
├── index.html          # Homepage with product listing
├── product.html        # Product details page
├── cart.html          # Shopping cart
├── login.html         # Login and registration
├── orders.html        # Order history
├── support.html       # Customer support
├── admin.html         # Admin panel
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── api.js         # API communication
│   ├── cart.js        # Cart management
│   └── auth.js        # Authentication
├── images/
│   └── placeholder.jpg # Placeholder images
└── README.md          # This file
```

## 🔧 Setup & Installation

1. **Clone or download** the project files
2. **Start a local server**:
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx serve -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
3. **Open browser** and navigate to `http://localhost:8080`

## 🔌 Backend Integration

### API Endpoints Expected

The frontend is designed to work with these Django REST API endpoints:

#### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - User profile

#### Products & Categories
- `GET /api/catalog/products/` - List products
- `GET /api/catalog/products/{id}/` - Product details
- `GET /api/catalog/categories/` - List categories

#### Cart & Orders
- `GET /api/orders/cart/` - Get cart items
- `POST /api/orders/cart/add/` - Add to cart
- `PATCH /api/orders/cart/{id}/` - Update cart item
- `DELETE /api/orders/cart/{id}/` - Remove from cart
- `GET /api/orders/orders/` - List orders
- `POST /api/orders/checkout/` - Create order

#### Admin (requires authentication)
- `POST /api/catalog/products/` - Create product
- `PATCH /api/catalog/products/{id}/` - Update product
- `DELETE /api/catalog/products/{id}/` - Delete product

### Configuration

Update the API base URL in `js/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url.com/api';
```

## 🎨 Customization

### Colors & Branding
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #f59e0b;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    --accent-color: #06b6d4;
}
```

### Logo & Branding
- Replace "ShopHub" with your brand name in all HTML files
- Add your logo image and update the header sections

### Features
- Modify `js/api.js` to match your backend API structure
- Update form fields in HTML files to match your data models
- Customize the admin panel based on your business needs

## 📱 Responsive Design

The frontend is fully responsive with breakpoints:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🔒 Security Features

- **CSRF Protection** - Token-based authentication
- **Input Validation** - Client-side form validation
- **XSS Prevention** - Proper data sanitization
- **Secure Storage** - JWT tokens in localStorage with expiration

## 🚀 Performance

- **Optimized Images** - Responsive images with proper sizing
- **Minified Assets** - Compressed CSS and JavaScript
- **Lazy Loading** - Images and content loaded on demand
- **Caching** - Browser caching for static assets

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads and displays products
- [ ] Search and filtering work correctly
- [ ] Product pages show details and allow adding to cart
- [ ] Cart management (add, update, remove items)
- [ ] User registration and login
- [ ] Order placement and history
- [ ] Admin panel functionality (if admin user)
- [ ] Responsive design on different screen sizes

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🐛 Troubleshooting

### Common Issues

1. **Products not loading**
   - Check if backend API is running
   - Verify API_BASE_URL in `js/api.js`
   - Check browser console for CORS errors

2. **Login not working**
   - Ensure authentication endpoints are correct
   - Check if JWT tokens are being stored
   - Verify CORS settings on backend

3. **Cart not persisting**
   - Check localStorage in browser dev tools
   - Ensure cart API endpoints are working
   - Verify user authentication

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for modern e-commerce experiences**

