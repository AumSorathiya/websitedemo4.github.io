// User Authentication System
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('bravenza-user')) || null;
        this.users = JSON.parse(localStorage.getItem('bravenza-users')) || [];
        this.updateAuthDisplay();
    }

    // Register new user
    register(userData) {
        const { name, email, password, confirmPassword } = userData;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            addresses: [],
            orders: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login after registration
        this.currentUser = { ...newUser };
        delete this.currentUser.password; // Don't store password in current user
        this.saveCurrentUser();
        this.updateAuthDisplay();
        
        return { success: true, message: 'Account created successfully!' };
    }

    // Login user
    login(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('No account found with this email address');
        }
        
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Incorrect password');
        }
        
        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in current user
        this.saveCurrentUser();
        this.updateAuthDisplay();
        
        return { success: true, message: 'Login successful!' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('bravenza-user');
        this.updateAuthDisplay();
        
        // Clear any user-specific data
        window.cart.clearCart();
        
        return { success: true, message: 'Logged out successfully!' };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Add address to user profile
    addAddress(addressData) {
        if (!this.isLoggedIn()) {
            throw new Error('Please log in to save addresses');
        }
        
        const address = {
            id: Date.now(),
            ...addressData,
            isDefault: this.currentUser.addresses.length === 0
        };
        
        this.currentUser.addresses.push(address);
        this.updateUserInStorage();
        
        return address;
    }

    // Add order to user history
    addOrder(orderData) {
        if (!this.isLoggedIn()) {
            throw new Error('Please log in to place orders');
        }
        
        const order = {
            id: Date.now(),
            userId: this.currentUser.id,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.currentUser.orders.push(order);
        this.updateUserInStorage();
        
        return order;
    }

    // Get user orders
    getUserOrders() {
        return this.isLoggedIn() ? this.currentUser.orders || [] : [];
    }

    // Get user addresses
    getUserAddresses() {
        return this.isLoggedIn() ? this.currentUser.addresses || [] : [];
    }

    // Update user in both current user and users array
    updateUserInStorage() {
        if (!this.isLoggedIn()) return;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...this.currentUser };
            this.saveUsers();
        }
        this.saveCurrentUser();
    }

    // Save current user to localStorage
    saveCurrentUser() {
        localStorage.setItem('bravenza-user', JSON.stringify(this.currentUser));
    }

    // Save all users to localStorage
    saveUsers() {
        localStorage.setItem('bravenza-users', JSON.stringify(this.users));
    }

    // Update auth display throughout the app
    updateAuthDisplay() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const userNameSpan = document.getElementById('user-name');
        
        if (this.isLoggedIn()) {
            if (loginBtn) loginBtn.textContent = 'Account';
            if (userNameSpan) userNameSpan.textContent = this.currentUser.name;
            if (userMenu) userMenu.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.textContent = 'Login';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // Simple password hashing (in production, use proper hashing)
    hashPassword(password) {
        // Simple hash for demo - in production use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    // Verify password
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password strength validation
    validatePasswordStrength(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        const score = {
            length: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            total: 0
        };
        
        score.total = [score.length, score.hasUpperCase, score.hasLowerCase, score.hasNumbers]
            .filter(Boolean).length;
        
        let strength = 'Weak';
        if (score.total >= 4) strength = 'Strong';
        else if (score.total >= 3) strength = 'Medium';
        
        return { score, strength };
    }
}

// Initialize auth manager
window.authManager = new AuthManager();