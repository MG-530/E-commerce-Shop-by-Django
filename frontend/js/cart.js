// Cart Management Module

// Local storage cart key
const CART_STORAGE_KEY = 'cart';

// Cart state
let cartState = {
    items: [],
    total: 0,
    count: 0
};

// Initialize cart on page load
function initCart() {
    if (isAuthenticated()) {
        // Load cart from server
        loadServerCart();
    } else {
        // Load cart from localStorage
        loadLocalCart();
    }
    updateCartCount();
}

// Get local cart from localStorage
function getLocalCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error loading local cart:', error);
        return [];
    }
}

// Save cart to localStorage
function saveLocalCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving local cart:', error);
    }
}

// Load cart from localStorage
function loadLocalCart() {
    const cart = getLocalCart();
    cartState.items = cart;
    cartState.count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartState.total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Load cart from server
async function loadServerCart() {
    try {
        const cartResponse = await CartAPI.getCart();
        if (cartResponse.results && cartResponse.results.length > 0) {
            const cart = cartResponse.results[0];
            const itemsResponse = await CartAPI.getCartItems(cart.id);
            cartState.items = itemsResponse.results || [];
            cartState.count = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
            cartState.total = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else {
            cartState.items = [];
            cartState.count = 0;
            cartState.total = 0;
        }
    } catch (error) {
        console.error('Error loading server cart:', error);
        // Fallback to local cart
        loadLocalCart();
    }
}

// Replace addToCart function in cart.js with this debug version:

async function addToCart(productId, productName, price, quantity = 1) {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Product ID:', productId);
    console.log('Product Name:', productName);
    console.log('Price:', price);
    console.log('Quantity:', quantity);
    
    // Check authentication state
    console.log('Checking authentication...');
    const authToken = localStorage.getItem('authToken');
    const authUser = localStorage.getItem('authUser');
    console.log('Token exists:', !!authToken);
    console.log('User exists:', !!authUser);
    console.log('isAuthenticated() result:', typeof isAuthenticated === 'function' ? isAuthenticated() : 'function not available');
    
    try {
        if (isAuthenticated && isAuthenticated()) {
            console.log('User is authenticated, adding to server cart...');
            await addToServerCart(productId, quantity);
            console.log('Successfully added to server cart');
        } else {
            console.log('User not authenticated, adding to local cart...');
            addToLocalCart(productId, productName, price, quantity);
            console.log('Successfully added to local cart');
        }
        
        console.log('Updating cart count...');
        updateCartCount();
        
        console.log('Showing notification...');
        showCartNotification(`Added ${productName} to cart!`);
        
        console.log('=== ADD TO CART SUCCESS ===');
        
    } catch (error) {
        console.error('=== ADD TO CART ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        alert('Error adding item to cart: ' + error.message);
    }
}

// Also add debug to addToServerCart
async function addToServerCart(productId, quantity) {
    console.log('=== ADD TO SERVER CART DEBUG ===');
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);
    
    try {
        // Get or create cart
        console.log('Getting user cart...');
        let cartResponse = await CartAPI.getCart();
        console.log('Cart response:', cartResponse);
        
        let cart;
        if (!cartResponse.results || cartResponse.results.length === 0) {
            console.log('No cart found, creating new cart...');
            cart = await CartAPI.createCart();
            console.log('Created cart:', cart);
        } else {
            cart = cartResponse.results[0];
            console.log('Using existing cart:', cart);
        }
        
        // Check if item already exists in cart
        console.log('Getting cart items...');
        const itemsResponse = await CartAPI.getCartItems(cart.id);
        console.log('Cart items response:', itemsResponse);
        
        const existingItem = itemsResponse.results.find(item => item.product === productId);
        console.log('Existing item:', existingItem);
        
        if (existingItem) {
            console.log('Updating existing item quantity...');
            const newQuantity = existingItem.quantity + quantity;
            console.log('New quantity:', newQuantity);
            await CartAPI.updateCartItem(existingItem.id, newQuantity);
            console.log('Updated item successfully');
        } else {
            console.log('Adding new item to cart...');
            const addResult = await CartAPI.addToCart(cart.id, productId, quantity);
            console.log('Add result:', addResult);
        }
        
        // Reload cart state
        console.log('Reloading cart state...');
        await loadServerCart();
        console.log('Cart state reloaded successfully');
        
    } catch (error) {
        console.error('=== ADD TO SERVER CART ERROR ===');
        console.error('Error details:', error);
        throw error; // Re-throw to be caught by parent function
    }
}

// Debug local cart as well
function addToLocalCart(productId, productName, price, quantity) {
    console.log('=== ADD TO LOCAL CART DEBUG ===');
    console.log('Adding to local cart:', { productId, productName, price, quantity });
    
    try {
        const cart = getLocalCart();
        console.log('Current local cart:', cart);
        
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        console.log('Existing item index:', existingItemIndex);
        
        if (existingItemIndex > -1) {
            console.log('Updating existing local item...');
            cart[existingItemIndex].quantity += quantity;
            console.log('Updated item:', cart[existingItemIndex]);
        } else {
            console.log('Adding new local item...');
            const newItem = {
                id: productId,
                name: productName,
                price: price,
                quantity: quantity
            };
            cart.push(newItem);
            console.log('Added new item:', newItem);
        }
        
        console.log('Saving local cart...');
        saveLocalCart(cart);
        console.log('Loading local cart state...');
        loadLocalCart();
        console.log('Local cart updated successfully');
        
    } catch (error) {
        console.error('=== ADD TO LOCAL CART ERROR ===');
        console.error('Error details:', error);
        throw error;
    }
}

// Remove item from cart
async function removeFromCart(itemId, isLocal = false) {
    try {
        if (isLocal) {
            removeFromLocalCart(itemId);
        } else if (isAuthenticated()) {
            await CartAPI.removeFromCart(itemId);
            await loadServerCart();
        }
        
        updateCartCount();
        showCartNotification('Item removed from cart');
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Error removing item from cart');
    }
}

// Remove item from local cart
function removeFromLocalCart(index) {
    const cart = getLocalCart();
    cart.splice(index, 1);
    saveLocalCart(cart);
    loadLocalCart();
}

// Update item quantity in cart
async function updateCartQuantity(itemId, newQuantity, isLocal = false) {
    if (newQuantity < 1) {
        return removeFromCart(itemId, isLocal);
    }
    
    try {
        if (isLocal) {
            updateLocalCartQuantity(itemId, newQuantity);
        } else if (isAuthenticated()) {
            await CartAPI.updateCartItem(itemId, newQuantity);
            await loadServerCart();
        }
        
        updateCartCount();
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        alert('Error updating quantity');
    }
}

// Update local cart quantity
function updateLocalCartQuantity(index, newQuantity) {
    const cart = getLocalCart();
    if (cart[index]) {
        cart[index].quantity = newQuantity;
        saveLocalCart(cart);
        loadLocalCart();
    }
}

// Clear entire cart
async function clearCart() {
    try {
        if (isAuthenticated()) {
            const cartResponse = await CartAPI.getCart();
            if (cartResponse.results && cartResponse.results.length > 0) {
                const cart = cartResponse.results[0];
                const itemsResponse = await CartAPI.getCartItems(cart.id);
                
                // Remove all items
                for (const item of itemsResponse.results) {
                    await CartAPI.removeFromCart(item.id);
                }
            }
        } else {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
        
        cartState.items = [];
        cartState.count = 0;
        cartState.total = 0;
        updateCartCount();
        
    } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Error clearing cart');
    }
}

// Update cart count in UI
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartState.count;
    });
}

// Get cart summary
function getCartSummary() {
    return {
        items: cartState.items,
        count: cartState.count,
        subtotal: cartState.total,
        shipping: cartState.total > 100 ? 0 : 10, // Free shipping over $100
        tax: cartState.total * 0.08, // 8% tax
        total: cartState.total + (cartState.total > 100 ? 0 : 10) + (cartState.total * 0.08)
    };
}

// Show cart notification
function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Sync local cart with server when user logs in
async function syncCartWithServer() {
    const localCart = getLocalCart();
    if (localCart.length === 0) return;
    
    try {
        // Get or create server cart
        let cartResponse = await CartAPI.getCart();
        let cart;
        
        if (!cartResponse.results || cartResponse.results.length === 0) {
            cart = await CartAPI.createCart();
        } else {
            cart = cartResponse.results[0];
        }
        
        // Add local items to server cart
        for (const localItem of localCart) {
            try {
                await CartAPI.addToCart(cart.id, localItem.id, localItem.quantity);
            } catch (error) {
                console.error('Error syncing item:', localItem, error);
            }
        }
        
        // Clear local cart
        localStorage.removeItem(CART_STORAGE_KEY);
        
        // Load server cart
        await loadServerCart();
        updateCartCount();
        
        console.log('Cart synced successfully');
    } catch (error) {
        console.error('Error syncing cart with server:', error);
    }
}

// Mini cart widget (for header)
function createMiniCartWidget() {
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart';
    miniCart.innerHTML = `
        <div class="mini-cart-header">
            <h4>Shopping Cart (${cartState.count})</h4>
        </div>
        <div class="mini-cart-items">
            ${cartState.items.length === 0 ? 
                '<p>Your cart is empty</p>' :
                cartState.items.slice(0, 3).map(item => `
                    <div class="mini-cart-item">
                        <span class="item-name">${item.name || item.product_name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')
            }
            ${cartState.items.length > 3 ? `<p>... and ${cartState.items.length - 3} more items</p>` : ''}
        </div>
        <div class="mini-cart-footer">
            <div class="mini-cart-total">Total: $${cartState.total.toFixed(2)}</div>
            <div class="mini-cart-actions">
                <a href="cart.html" class="btn-view-cart">View Cart</a>
                ${cartState.items.length > 0 ? '<a href="cart.html" class="btn-checkout">Checkout</a>' : ''}
            </div>
        </div>
    `;
    
    return miniCart;
}

// Cart persistence across page reloads
window.addEventListener('beforeunload', () => {
    if (!isAuthenticated() && cartState.items.length > 0) {
        saveLocalCart(cartState.items);
    }
});

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartSummary = getCartSummary;
window.syncCartWithServer = syncCartWithServer;
window.updateCartCount = updateCartCount;
window.getLocalCart = getLocalCart;

