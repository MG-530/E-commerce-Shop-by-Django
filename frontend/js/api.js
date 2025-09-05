// API Configuration
const API_BASE_URL = 'http://localhost:8000'; // Change this to your Django backend URL

// API utility functions
// Replace the apiCall function in api.js with this fixed version:

async function apiCall(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Get authentication token
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Token ${token}`;
    } else {
    }
    
    // Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
      
    try {
        const response = await fetch(url, finalOptions);     
        // Handle different response types
        if (response.status === 204) {
            return null; // No content
        }
        
        if (!response.ok) {
            const responseText = await response.text();            
            let errorData = {};
            try {
                errorData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Could not parse error response as JSON:', parseError);
                errorData = { detail: responseText || 'Unknown error' };
            }
            
            throw new Error(`HTTP ${response.status}: ${errorData.detail || errorData.message || response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseText = await response.text();
            const jsonData = JSON.parse(responseText);
            return jsonData;
        }
        
        return await response.text();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
// Specific API functions for different endpoints

// Products API
const ProductsAPI = {
    // Get all products with optional filters
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/catalog/products/${queryString ? '?' + queryString : ''}`;
        return await apiCall(endpoint);
    },
    
    // Get single product by ID
    getProduct: async (id) => {
        return await apiCall(`/api/catalog/products/${id}/`);
    },
    
    // Search products
    searchProducts: async (query, filters = {}) => {
        const params = { search: query, ...filters };
        return await ProductsAPI.getProducts(params);
    }
};

// Categories API
const CategoriesAPI = {
    // Get all categories
    getCategories: async () => {
        return await apiCall('/api/catalog/categories/');
    },
    
    // Get category by ID
    getCategory: async (id) => {
        return await apiCall(`/api/catalog/categories/${id}/`);
    }
};

// Comments API
const CommentsAPI = {
    // Get comments for a product
    getComments: async (productId) => {
        return await apiCall(`/api/catalog/comments/?product=${productId}`);
    },
    
    // Add a comment
    addComment: async (commentData) => {
        return await apiCall('/api/catalog/comments/', {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    },
    
    // Update a comment
    updateComment: async (id, commentData) => {
        return await apiCall(`/api/catalog/comments/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(commentData)
        });
    },
    
    // Delete a comment
    deleteComment: async (id) => {
        return await apiCall(`/api/catalog/comments/${id}/`, {
            method: 'DELETE'
        });
    }
};

// Cart API
const CartAPI = {
    // Get user's cart
    getCart: async () => {
        return await apiCall('/api/orders/carts/');
    },
    
    // Create a new cart
    createCart: async () => {
        return await apiCall('/api/orders/carts/', {
            method: 'POST',
            body: JSON.stringify({})
        });
    },
    
    // Get cart items
    getCartItems: async (cartId) => {
        return await apiCall(`/api/orders/cart-items/?cart=${cartId}`);
    },
    
    // Add item to cart
    addToCart: async (cartId, productId, quantity = 1) => {
        return await apiCall('/api/orders/cart-items/', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartId,
                product: productId,
                quantity: quantity
            })
        });
    },
    
    // Update cart item quantity
    updateCartItem: async (itemId, quantity) => {
        return await apiCall(`/api/orders/cart-items/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: quantity })
        });
    },
    
    // Remove item from cart
    removeFromCart: async (itemId) => {
        return await apiCall(`/api/orders/cart-items/${itemId}/`, {
            method: 'DELETE'
        });
    }
};

// Orders API
const OrdersAPI = {
    // Get user's orders
    getOrders: async () => {
        return await apiCall('/api/orders/orders/');
    },
    
    // Get single order
    getOrder: async (id) => {
        return await apiCall(`/api/orders/orders/${id}/`);
    },
    
    // Create new order
    createOrder: async (orderData) => {
        return await apiCall('/api/orders/orders/', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    
    // Update order status
    updateOrder: async (id, orderData) => {
        return await apiCall(`/api/orders/orders/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(orderData)
        });
    },
    
    // Get order items
    getOrderItems: async (orderId) => {
        return await apiCall(`/api/orders/order-items/?order=${orderId}`);
    }
};

// Users API
const UsersAPI = {
    // Get current user profile
    getProfile: async () => {
        return await apiCall('/api/users/users/me/');
    },
    
    // Update user profile
    updateProfile: async (userData) => {
        return await apiCall('/api/users/users/me/', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    },
    
    // Get user addresses
    getAddresses: async () => {
        return await apiCall('/api/users/addresses/');
    },
    
    // Add new address
    addAddress: async (addressData) => {
        return await apiCall('/api/users/addresses/', {
            method: 'POST',
            body: JSON.stringify(addressData)
        });
    },
    
    // Update address
    updateAddress: async (id, addressData) => {
        return await apiCall(`/api/users/addresses/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(addressData)
        });
    },
    
    // Delete address
    deleteAddress: async (id) => {
        return await apiCall(`/api/users/addresses/${id}/`, {
            method: 'DELETE'
        });
    }
};

// Wishlist API
const WishlistAPI = {
    // Get user's wishlist
    getWishlist: async () => {
        return await apiCall('/api/wishlist/');
    },
    
    // Add item to wishlist
    addToWishlist: async (productId) => {
        return await apiCall('/api/wishlist/', {
            method: 'POST',
            body: JSON.stringify({ product: productId })
        });
    },
    
    // Remove item from wishlist
    removeFromWishlist: async (itemId) => {
        return await apiCall(`/api/wishlist/${itemId}/`, {
            method: 'DELETE'
        });
    }
};

// Support API
const SupportAPI = {
    // Get support tickets
    getTickets: async () => {
        return await apiCall('/api/support/');
    },
    
    // Create support ticket
    createTicket: async (ticketData) => {
        return await apiCall('/api/support/', {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
    },
    
    // Get single ticket
    getTicket: async (id) => {
        return await apiCall(`/api/support/${id}/`);
    },
    
    // Update ticket
    updateTicket: async (id, ticketData) => {
        return await apiCall(`/api/support/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(ticketData)
        });
    }
};

// Returns API
const ReturnsAPI = {
    // Get return requests
    getReturns: async () => {
        return await apiCall('/api/returns/');
    },
    
    // Create return request
    createReturn: async (returnData) => {
        return await apiCall('/api/returns/', {
            method: 'POST',
            body: JSON.stringify(returnData)
        });
    },
    
    // Get single return
    getReturn: async (id) => {
        return await apiCall(`/api/returns/${id}/`);
    },
    
    // Update return status
    updateReturn: async (id, returnData) => {
        return await apiCall(`/api/returns/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(returnData)
        });
    }
};

// Error handling utilities
function handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    if (error.message.includes('401')) {
        // Unauthorized - redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
    }
    
    if (error.message.includes('403')) {
        alert('You do not have permission to perform this action.');
        return;
    }
    
    if (error.message.includes('404')) {
        alert('The requested resource was not found.');
        return;
    }
    
    if (error.message.includes('500')) {
        alert('Server error. Please try again later.');
        return;
    }
    
    // Generic error message
    alert(`An error occurred: ${error.message}`);
}

// Loading state management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
        element.textContent = 'Loading...';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        apiCall,
        ProductsAPI,
        CategoriesAPI,
        CommentsAPI,
        CartAPI,
        OrdersAPI,
        UsersAPI,
        WishlistAPI,
        SupportAPI,
        ReturnsAPI,
        handleApiError,
        showLoading,
        hideLoading,
        formatCurrency,
        formatDate,
        debounce
    };
}

