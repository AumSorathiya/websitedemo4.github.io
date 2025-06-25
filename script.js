// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    loadProducts();
    setupEventListeners();
    setupNavigation();
}

// Product loading and display
function loadProducts() {
    loadFeaturedProducts();
    loadWomenProducts();
    loadMenProducts();
}

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featuredProducts = window.productsData.filter(product => product.featured);
    displayProducts(container, featuredProducts);
}

function loadWomenProducts() {
    const container = document.getElementById('women-products');
    const womenProducts = window.productsData.filter(product => product.category === 'women');
    displayProducts(container, womenProducts);
}

function loadMenProducts() {
    const container = document.getElementById('men-products');
    const menProducts = window.productsData.filter(product => product.category === 'men');
    displayProducts(container, menProducts);
}

function displayProducts(container, products) {
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.position = 'relative';
    
    card.innerHTML = `
        ${product.bestseller ? '<div class="bestseller-badge">Bestseller</div>' : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            <p class="product-description">${product.description}</p>
        </div>
    `;
    
    card.addEventListener('click', () => showProductModal(product));
    
    return card;
}

// Modal functionality
function showProductModal(product) {
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    const sizeSelect = document.getElementById('size-select');
    
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalName.textContent = product.name;
    modalPrice.textContent = `$${product.price}`;
    modalDescription.textContent = product.description;
    
    // Populate size options
    sizeSelect.innerHTML = '';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    // Store current product
    modal.dataset.productId = product.id;
    
    modal.style.display = 'block';
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    console.log('Showing cart modal...');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    const items = window.cart.getCartItems();
    console.log('Cart items to display:', items);
    
    if (items.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 2rem;">Your cart is empty</p>';
    } else {
        items.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    const total = window.cart.getTotalPrice();
    cartTotal.textContent = total.toFixed(2);
    console.log('Cart total:', total);
    
    modal.style.display = 'block';
}

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
        <img src="${item.product.image}" alt="${item.product.name}">
        <div class="cart-item-info">
            <h4>${item.product.name}</h4>
            <p>Size: ${item.size}</p>
            <p>$${item.product.price} each</p>
        </div>
        <div class="cart-item-controls">
            <button onclick="updateCartItemQuantity(${item.product.id}, '${item.size}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItemQuantity(${item.product.id}, '${item.size}', ${item.quantity + 1})">+</button>
            <button onclick="removeCartItem(${item.product.id}, '${item.size}')" style="background: #dc3545; margin-left: 1rem;">Remove</button>
        </div>
    `;
    
    return cartItem;
}

function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    populateCheckoutSummary();
    modal.style.display = 'block';
    
    // Reset to first step
    currentCheckoutStep = 1;
    showCheckoutStep(1);
}

function showSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'block';
    document.getElementById('search-input').focus();
}

function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function showSignupModal() {
    document.getElementById('signup-modal').style.display = 'block';
}

// Cart item management
function updateCartItemQuantity(productId, size, newQuantity) {
    window.cart.updateQuantity(productId, size, newQuantity);
    showCartModal(); // Refresh the cart display
}

function removeCartItem(productId, size) {
    window.cart.removeItem(productId, size);
    showCartModal(); // Refresh the cart display
}

// Checkout functionality
let currentCheckoutStep = 1;

function showCheckoutStep(step) {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step-${i}`).classList.add('hidden');
        document.querySelector(`[data-step="${i}"]`).classList.remove('active');
    }
    
    // Show current step
    document.getElementById(`step-${step}`).classList.remove('hidden');
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const placeOrderBtn = document.getElementById('place-order');
    
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    
    if (step < 4) {
        nextBtn.style.display = 'block';
        placeOrderBtn.classList.add('hidden');
    } else {
        nextBtn.style.display = 'none';
        placeOrderBtn.classList.remove('hidden');
    }
}

function populateCheckoutSummary() {
    const items = window.cart.getCartItems();
    const checkoutItems = document.getElementById('checkout-items');
    const subtotal = window.cart.getTotalPrice();
    const shipping = subtotal > 200 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    checkoutItems.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '0.5rem';
        itemDiv.innerHTML = `
            <span>${item.product.name} (${item.size}) x${item.quantity}</span>
            <span>$${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-final-total').textContent = `$${total.toFixed(2)}`;
}

// Search functionality
function performSearch(query) {
    const results = window.productsData.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 2rem;">No products found</p>';
        return;
    }
    
    results.forEach(product => {
        const result = document.createElement('div');
        result.className = 'search-result';
        result.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
        `;
        result.addEventListener('click', () => {
            closeModal('search-modal');
            showProductModal(product);
        });
        searchResults.appendChild(result);
    });
}

// Event listeners setup
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('search-btn').addEventListener('click', showSearchModal);
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('cart-btn').addEventListener('click', showCartModal);
    document.getElementById('explore-btn').addEventListener('click', () => {
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Product modal quantity controls
    document.getElementById('quantity-minus').addEventListener('click', () => {
        const quantityValue = document.getElementById('quantity-value');
        const currentValue = parseInt(quantityValue.textContent);
        if (currentValue > 1) {
            quantityValue.textContent = currentValue - 1;
        }
    });
    
    document.getElementById('quantity-plus').addEventListener('click', () => {
        const quantityValue = document.getElementById('quantity-value');
        const currentValue = parseInt(quantityValue.textContent);
        quantityValue.textContent = currentValue + 1;
    });
    
    // Add to cart button
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const modal = document.getElementById('product-modal');
        const productId = parseInt(modal.dataset.productId);
        const product = window.productsData.find(p => p.id === productId);
        const size = document.getElementById('size-select').value;
        const quantity = parseInt(document.getElementById('quantity-value').textContent);
        
        console.log('Add to cart clicked:', { productId, product: product?.name, size, quantity });
        
        if (product && size) {
            window.cart.addItem(product, size, quantity);
            closeModal('product-modal');
            
            // Force refresh cart display after short delay
            setTimeout(() => {
                showCartModal();
            }, 100);
        } else {
            window.cart.showToast('Please select a size');
        }
    });
    
    // Cart actions
    document.getElementById('clear-cart-btn').addEventListener('click', () => {
        window.cart.clearCart();
        showCartModal();
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (window.cart.getTotalItems() === 0) {
            window.cart.showToast('Your cart is empty');
            return;
        }
        closeModal('cart-modal');
        window.checkoutManager.startCheckout();
    });
    
    // Enhanced checkout navigation
    document.getElementById('checkout-next-btn').addEventListener('click', () => {
        window.checkoutManager.nextStep();
    });
    
    document.getElementById('checkout-prev-btn').addEventListener('click', () => {
        window.checkoutManager.previousStep();
    });
    
    document.getElementById('checkout-place-order-btn').addEventListener('click', () => {
        window.checkoutManager.placeOrder();
    });
    
    // Password strength indicator
    document.getElementById('signup-password').addEventListener('input', updatePasswordStrength);
    
    // Profile tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            showProfileTab(tabName);
        });
    });
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            performSearch(query);
        } else {
            document.getElementById('search-results').innerHTML = '';
        }
    });
    
    // Newsletter form
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
            window.cart.showToast('Successfully subscribed to newsletter!');
            document.getElementById('newsletter-email').value = '';
        }
    });
    
    // Authentication forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Profile management
    document.getElementById('account-btn').addEventListener('click', showProfileModal);
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    document.getElementById('profile-link').addEventListener('click', showProfileModal);
    document.getElementById('orders-link').addEventListener('click', showProfileModal);
    
    // Switch between login/signup
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('login-modal');
        showSignupModal();
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('signup-modal');
        showLoginModal();
    });
    
    // Mobile menu toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        const navMenu = document.getElementById('nav-menu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Navigation setup
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const result = window.authManager.login(email, password);
        window.cart.showToast(result.message);
        closeModal('login-modal');
        e.target.reset();
    } catch (error) {
        window.cart.showToast(error.message);
    }
}

function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    try {
        const result = window.authManager.register(userData);
        window.cart.showToast(result.message);
        closeModal('signup-modal');
        e.target.reset();
    } catch (error) {
        window.cart.showToast(error.message);
    }
}

function handleLogout(e) {
    e.preventDefault();
    const result = window.authManager.logout();
    window.cart.showToast(result.message);
    closeModal('profile-modal');
}

function showProfileModal() {
    if (!window.authManager.isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const modal = document.getElementById('profile-modal');
    modal.style.display = 'block';
    populateProfileData();
}

function populateProfileData() {
    const user = window.authManager.getCurrentUser();
    if (!user) return;
    
    // Populate profile form
    const profileForm = document.getElementById('profile-form');
    const nameParts = user.name.split(' ');
    profileForm.querySelector('input[name="firstName"]').value = nameParts[0] || '';
    profileForm.querySelector('input[name="lastName"]').value = nameParts.slice(1).join(' ') || '';
    profileForm.querySelector('input[name="email"]').value = user.email;
    profileForm.querySelector('input[name="phone"]').value = user.phone || '';
    
    // Populate orders
    populateOrders();
    
    // Populate addresses
    populateAddresses();
}

function populateOrders() {
    const ordersList = document.getElementById('orders-list');
    const orders = window.authManager.getUserOrders();
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 2rem;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.orderId}</span>
                <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <p>Date: ${new Date(order.timestamp).toLocaleDateString()}</p>
            <p>Total: $${order.order.total.toFixed(2)}</p>
            <p>Items: ${order.order.items.length}</p>
        `;
        ordersList.appendChild(orderElement);
    });
}

function populateAddresses() {
    const addressesList = document.getElementById('addresses-list');
    const addresses = window.authManager.getUserAddresses();
    
    if (addresses.length === 0) {
        addressesList.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 2rem;">No saved addresses</p>';
        return;
    }
    
    addressesList.innerHTML = '';
    addresses.forEach(address => {
        const addressElement = document.createElement('div');
        addressElement.className = 'address-item';
        addressElement.innerHTML = `
            ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
            <p><strong>${address.address}</strong></p>
            <p>${address.city}, ${address.state} ${address.zipCode}</p>
            <p>${address.country}</p>
        `;
        addressesList.appendChild(addressElement);
    });
}

function showProfileTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Show selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Refresh data if needed
    if (tabName === 'orders') populateOrders();
    if (tabName === 'addresses') populateAddresses();
}

function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthElement = document.getElementById('password-strength');
    
    if (password.length === 0) {
        strengthElement.innerHTML = '';
        return;
    }
    
    const validation = window.authManager.validatePasswordStrength(password);
    strengthElement.innerHTML = `
        <div class="strength-${validation.strength.toLowerCase()}">
            Password strength: ${validation.strength}
        </div>
    `;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});