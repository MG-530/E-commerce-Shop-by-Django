// Authentication Module

// Authentication state
let authState = {
    isAuthenticated: false,
    user: null,
    token: null
};

// Initialize authentication on page load
function initAuth() {
    loadAuthFromStorage();
    updateAuthUI();
}

// Load authentication data from localStorage
function loadAuthFromStorage() {
    
    try {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('authUser');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                
                authState.user = user;
                authState.token = token;
                authState.isAuthenticated = true;
                
                return true;
            } catch (parseError) {
                console.error('Error parsing stored user JSON:', parseError);
                clearAuth();
                return false;
            }
        } else {
            authState.isAuthenticated = false;
            return false;
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        clearAuth();
        return false;
    }
}

// Save authentication data to localStorage
function saveAuthToStorage(token, user) {    
    try {
        if (!token) {
            console.error('No token provided to saveAuthToStorage');
            return false;
        }
        
        if (!user) {
            console.error('No user data provided to saveAuthToStorage');
            return false;
        }
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
        
        // Update state
        authState.token = token;
        authState.user = user;
        authState.isAuthenticated = true;
                
        // Verify it was saved
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');
        return true;
    } catch (error) {
        console.error('Error saving auth to storage:', error);
        return false;
    }
}

// Clear authentication data
function clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    authState.isAuthenticated = false;
    authState.user = null;
    authState.token = null;
}

// Check if user is authenticated
function isAuthenticated() {
    return authState.isAuthenticated && authState.token;
}

// Get current user
function getCurrentUser() {
    return authState.user;
}

// Get auth token
function getAuthToken() {
    return authState.token;
}

// Replace the login function in auth.js with this corrected version:

async function login(email, password) {    
    try {
        // Based on the error message, Django expects 'email' field, so let's use JSON
        const response = await apiCall('/api/users/api-token-auth/', {
            method: 'POST',
            body: JSON.stringify({ 
                email: email,        // Django expects 'email' field
                password: password 
            })
        });
        
        
        if (response && response.token) {
            const saveResult = saveAuthToStorage(response.token, response.user);
            
            updateAuthUI();

            if (typeof syncCartWithServer === 'function') {
                await syncCartWithServer();
            }

            return { success: true, user: response.user };
        } else {
            console.error('Login failed - no token in response:', response);
            return { success: false, error: response.detail || response.message || 'Invalid credentials' };
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Try to extract more detailed error information
        let errorMessage = error.message;
        if (error.message.includes('400') && error.message.includes('Bad Request')) {
            // The API debug should have logged the actual error response
            errorMessage = 'Please check your email and password';
        }
        
        return { success: false, error: errorMessage };
    }
}

async function login(email, password) {
    try {
        const response = await apiCall('/api/users/api-token-auth/', {
            method: 'POST',
            body: JSON.stringify({ 
                email: email,
                password: password 
            })
        });
        
        
        if (response && response.token) {
            
            // Create user object from Django response format
            const userObj = {
                id: response.user_id,
                email: response.email,
                username: response.username || response.email,
                first_name: response.first_name || '',
                last_name: response.last_name || '',
                is_staff: response.is_staff || false,
                is_superuser: response.is_superuser || false
            };
            
            const saveResult = saveAuthToStorage(response.token, userObj);
            
            updateAuthUI();

            if (typeof syncCartWithServer === 'function') {
                await syncCartWithServer();
            }

            return { success: true, user: userObj };
        } else {
            console.error('Login failed - no token in response:', response);
            return { success: false, error: response.detail || response.message || 'Invalid credentials' };
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Extract error message
        let errorMessage = error.message;
        if (error.message.includes('400')) {
            errorMessage = 'Invalid email or password';
        } else if (error.message.includes('401')) {
            errorMessage = 'Invalid credentials';
        } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Alternative: Try with FormData if JSON doesn't work
async function loginWithFormData(email, password) {
    try {
        const formData = new FormData();
        formData.append('email', email);      // Use 'email' instead of 'username'
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE_URL}/api/users/api-token-auth/`, {
            method: 'POST',
            body: formData
        });
        
        const responseText = await response.text();
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            if (data.token) {
                saveAuthToStorage(data.token, data.user);
                updateAuthUI();
                return { success: true, user: data.user };
            }
        }
        
        const errorData = JSON.parse(responseText);
        return { success: false, error: errorData.detail || JSON.stringify(errorData) };
    } catch (error) {
        console.error('FormData login failed:', error);
        return { success: false, error: error.message };
    }
}

// Register function
async function register(userData) {
    try {
        const response = await apiCall('/api/users/users/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        return { success: true, user: response };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
}

// Logout function
function logout() {
    clearAuth();
    updateAuthUI();
    
    // Clear cart if needed
    if (typeof clearCart === 'function') {
        // Don't clear cart, just update count
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Update authentication UI elements
function updateAuthUI() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (isAuthenticated()) {
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (logoutLink) {
            logoutLink.style.display = 'inline';
            logoutLink.textContent = `Logout (${authState.user.first_name || authState.user.username})`;
        }
    } else {
        if (loginLink) {
            loginLink.style.display = 'inline';
        }
        if (logoutLink) {
            logoutLink.style.display = 'none';
        }
    }
    
    // Update user-specific elements
    updateUserElements();
}

// Update user-specific UI elements
function updateUserElements() {
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    const authRequiredElements = document.querySelectorAll('.auth-required');
    const guestOnlyElements = document.querySelectorAll('.guest-only');
    
    if (isAuthenticated()) {
        userNameElements.forEach(el => {
            el.textContent = authState.user.first_name 
                ? `${authState.user.first_name} ${authState.user.last_name}`.trim()
                : authState.user.username;
        });
        
        userEmailElements.forEach(el => {
            el.textContent = authState.user.email;
        });
        
        authRequiredElements.forEach(el => {
            el.style.display = '';
        });
        
        guestOnlyElements.forEach(el => {
            el.style.display = 'none';
        });
    } else {
        authRequiredElements.forEach(el => {
            el.style.display = 'none';
        });
        
        guestOnlyElements.forEach(el => {
            el.style.display = '';
        });
    }
}

// Require authentication for certain pages
function requireAuth() {
    if (!isAuthenticated()) {
        const currentPage = window.location.pathname.split('/').pop();
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        return false;
    }
    return true;
}

// Get user profile
async function getUserProfile() {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }
    
    try {
        const profile = await UsersAPI.getProfile();
        // Update stored user data
        authState.user = { ...authState.user, ...profile };
        localStorage.setItem('authUser', JSON.stringify(authState.user));
        return profile;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

// Update user profile
async function updateUserProfile(userData) {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }
    
    try {
        const updatedUser = await UsersAPI.updateProfile(userData);
        // Update stored user data
        authState.user = { ...authState.user, ...updatedUser };
        localStorage.setItem('authUser', JSON.stringify(authState.user));
        updateAuthUI();
        return updatedUser;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }
    
    try {
        const response = await apiCall('/api/users/users/change_password/', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: error.message };
    }
}

// Reset password (request)
async function requestPasswordReset(email) {
    try {
        const response = await apiCall('/api/users/password_reset/', {
            method: 'POST',
            body: JSON.stringify({ email: email })
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return { success: false, error: error.message };
    }
}

// Verify email
async function verifyEmail(token) {
    try {
        const response = await apiCall('/api/users/verify_email/', {
            method: 'POST',
            body: JSON.stringify({ token: token })
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error verifying email:', error);
        return { success: false, error: error.message };
    }
}

// Check if user has permission
function hasPermission(permission) {
    if (!isAuthenticated()) {
        return false;
    }
    
    // Check if user is staff/admin
    if (authState.user.is_staff || authState.user.is_superuser) {
        return true;
    }
    
    // Check specific permissions
    if (authState.user.permissions && authState.user.permissions.includes(permission)) {
        return true;
    }
    
    return false;
}

// Check if user is admin
function isAdmin() {
    return isAuthenticated() && (authState.user.is_staff || authState.user.is_superuser);
}

// Auto-refresh token (if your backend supports it)
async function refreshToken() {
    if (!authState.token) {
        return false;
    }
    
    try {
        const response = await apiCall('/api/users/token_refresh/', {
            method: 'POST',
            body: JSON.stringify({ token: authState.token })
        });
        
        if (response.token) {
            authState.token = response.token;
            localStorage.setItem('authToken', response.token);
            return true;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Token might be expired, logout user
        logout();
    }
    
    return false;
}

// Set up automatic token refresh (if supported)
function setupTokenRefresh() {
    // Refresh token every 30 minutes
    setInterval(async () => {
        if (isAuthenticated()) {
            await refreshToken();
        }
    }, 30 * 60 * 1000);
}

// Handle authentication errors globally
function handleAuthError(error) {
    if (error.message.includes('401') || error.message.includes('403')) {
        logout();
        alert('Your session has expired. Please login again.');
    }
}

// Social login handlers (placeholder implementations)
async function loginWithGoogle() {
    // This would integrate with Google OAuth
    alert('Google login would be implemented here with OAuth integration');
}

async function loginWithFacebook() {
    // This would integrate with Facebook OAuth
    alert('Facebook login would be implemented here with OAuth integration');
}

// Set up logout event listener
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Initialize auth
    initAuth();
    
    // Set up token refresh if supported
    // setupTokenRefresh();
});

// Export functions for global use
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;
window.login = login;
window.register = register;
window.logout = logout;
window.requireAuth = requireAuth;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword;
window.requestPasswordReset = requestPasswordReset;
window.verifyEmail = verifyEmail;
window.hasPermission = hasPermission;
window.isAdmin = isAdmin;
window.initAuth = initAuth;
window.updateAuthUI = updateAuthUI;
window.handleAuthError = handleAuthError;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;

