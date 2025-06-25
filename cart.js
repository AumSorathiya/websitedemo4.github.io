// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.updateCartDisplay();
        console.log('Cart initialized with', this.items.length, 'items');
    }
    
    loadCart() {
        try {
            const savedCart = localStorage.getItem('bravenza-cart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                console.log('Loaded cart from localStorage:', this.items);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    }

    addItem(product, size, quantity = 1) {
        console.log('Cart.addItem called:', product.name, size, quantity);
        
        const existingItemIndex = this.items.findIndex(
            item => item.product.id === product.id && item.size === size
        );

        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += quantity;
            console.log('Updated existing item quantity:', this.items[existingItemIndex].quantity);
        } else {
            const newItem = { product, size, quantity };
            this.items.push(newItem);
            console.log('Added new item:', newItem);
        }

        console.log('Total items in cart:', this.items.length);
        this.saveCart();
        this.updateCartDisplay();
        this.showToast(`${product.name} added to cart!`);
    }

    removeItem(productId, size) {
        this.items = this.items.filter(
            item => !(item.product.id === productId && item.size === size)
        );
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Item removed from cart');
    }

    updateQuantity(productId, size, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId, size);
            return;
        }

        const item = this.items.find(
            item => item.product.id === productId && item.size === size
        );

        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Cart cleared');
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => 
            total + (parseFloat(item.product.price) * item.quantity), 0
        );
    }

    saveCart() {
        try {
            localStorage.setItem('bravenza-cart', JSON.stringify(this.items));
            console.log('Cart saved to localStorage:', this.items);
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            console.log('Updated cart display - Total items:', totalItems);
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    getCartItems() {
        return this.items;
    }
}

// Initialize cart
window.cart = new ShoppingCart();