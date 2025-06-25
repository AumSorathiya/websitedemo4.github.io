// Enhanced Checkout Process
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.checkoutData = {
            customer: {},
            shipping: {},
            payment: {},
            order: {}
        };
    }

    // Initialize checkout process
    startCheckout() {
        if (window.cart.getTotalItems() === 0) {
            window.cart.showToast('Your cart is empty');
            return false;
        }

        this.currentStep = 1;
        this.populateCheckoutData();
        this.showCheckoutModal();
        return true;
    }

    // Populate initial checkout data
    populateCheckoutData() {
        const user = window.authManager.getCurrentUser();
        const cartItems = window.cart.getCartItems();
        
        // Pre-fill customer data if user is logged in
        if (user) {
            this.checkoutData.customer = {
                firstName: user.name.split(' ')[0] || '',
                lastName: user.name.split(' ').slice(1).join(' ') || '',
                email: user.email,
                phone: user.phone || ''
            };
            
            // Pre-fill shipping address if user has saved addresses
            const addresses = window.authManager.getUserAddresses();
            if (addresses.length > 0) {
                const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
                this.checkoutData.shipping = { ...defaultAddress };
            }
        }

        // Calculate order totals
        const subtotal = window.cart.getTotalPrice();
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        
        this.checkoutData.order = {
            items: cartItems,
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
        };
    }

    // Show checkout modal and initialize first step
    showCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        modal.style.display = 'block';
        this.showStep(1);
        this.updateOrderSummary();
    }

    // Navigate to specific step
    showStep(step) {
        if (step < 1 || step > this.totalSteps) return;
        
        this.currentStep = step;
        
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = document.getElementById(`checkout-step-${i}`);
            const indicator = document.querySelector(`[data-step="${i}"]`);
            
            if (stepElement) stepElement.classList.add('hidden');
            if (indicator) indicator.classList.remove('active');
        }
        
        // Show current step
        const currentStepElement = document.getElementById(`checkout-step-${step}`);
        const currentIndicator = document.querySelector(`[data-step="${step}"]`);
        
        if (currentStepElement) currentStepElement.classList.remove('hidden');
        if (currentIndicator) currentIndicator.classList.add('active');
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Pre-fill forms if data exists
        this.prefillStepData(step);
    }

    // Update navigation buttons based on current step
    updateNavigationButtons() {
        const prevBtn = document.getElementById('checkout-prev-btn');
        const nextBtn = document.getElementById('checkout-next-btn');
        const placeOrderBtn = document.getElementById('checkout-place-order-btn');
        
        // Previous button
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        // Next/Place Order buttons
        if (this.currentStep < this.totalSteps) {
            if (nextBtn) nextBtn.style.display = 'block';
            if (placeOrderBtn) placeOrderBtn.classList.add('hidden');
        } else {
            if (nextBtn) nextBtn.style.display = 'none';
            if (placeOrderBtn) placeOrderBtn.classList.remove('hidden');
        }
    }

    // Go to next step
    nextStep() {
        if (!this.validateCurrentStep()) {
            return false;
        }
        
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
        
        return true;
    }

    // Go to previous step
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    // Validate current step
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateCustomerInfo();
            case 2:
                return this.validateShippingInfo();
            case 3:
                return this.validatePaymentInfo();
            case 4:
                return true; // Review step, no validation needed
            default:
                return false;
        }
    }

    // Validate customer information
    validateCustomerInfo() {
        const form = document.getElementById('customer-form');
        const firstName = form.querySelector('input[name="firstName"]').value.trim();
        const lastName = form.querySelector('input[name="lastName"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const phone = form.querySelector('input[name="phone"]').value.trim();
        
        if (!firstName || !lastName || !email || !phone) {
            this.showError('Please fill in all customer information fields');
            return false;
        }
        
        if (!window.authManager.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    // Validate shipping information
    validateShippingInfo() {
        const form = document.getElementById('shipping-form');
        const address = form.querySelector('input[name="address"]').value.trim();
        const city = form.querySelector('input[name="city"]').value.trim();
        const state = form.querySelector('input[name="state"]').value.trim();
        const zipCode = form.querySelector('input[name="zipCode"]').value.trim();
        const country = form.querySelector('select[name="country"]').value;
        
        if (!address || !city || !state || !zipCode || !country) {
            this.showError('Please fill in all shipping address fields');
            return false;
        }
        
        return true;
    }

    // Validate payment information
    validatePaymentInfo() {
        const form = document.getElementById('payment-form');
        const cardNumber = form.querySelector('input[name="cardNumber"]').value.trim();
        const expiryDate = form.querySelector('input[name="expiryDate"]').value.trim();
        const cvv = form.querySelector('input[name="cvv"]').value.trim();
        const cardholderName = form.querySelector('input[name="cardholderName"]').value.trim();
        
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            this.showError('Please fill in all payment information fields');
            return false;
        }
        
        if (!this.validateCardNumber(cardNumber)) {
            this.showError('Please enter a valid card number');
            return false;
        }
        
        if (!this.validateExpiryDate(expiryDate)) {
            this.showError('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
        if (!this.validateCVV(cvv)) {
            this.showError('Please enter a valid CVV');
            return false;
        }
        
        return true;
    }

    // Save current step data
    saveCurrentStepData() {
        switch (this.currentStep) {
            case 1:
                this.saveCustomerData();
                break;
            case 2:
                this.saveShippingData();
                break;
            case 3:
                this.savePaymentData();
                break;
        }
    }

    // Save customer data
    saveCustomerData() {
        const form = document.getElementById('customer-form');
        this.checkoutData.customer = {
            firstName: form.querySelector('input[name="firstName"]').value.trim(),
            lastName: form.querySelector('input[name="lastName"]').value.trim(),
            email: form.querySelector('input[name="email"]').value.trim(),
            phone: form.querySelector('input[name="phone"]').value.trim()
        };
    }

    // Save shipping data
    saveShippingData() {
        const form = document.getElementById('shipping-form');
        this.checkoutData.shipping = {
            address: form.querySelector('input[name="address"]').value.trim(),
            city: form.querySelector('input[name="city"]').value.trim(),
            state: form.querySelector('input[name="state"]').value.trim(),
            zipCode: form.querySelector('input[name="zipCode"]').value.trim(),
            country: form.querySelector('select[name="country"]').value
        };
        
        // Save address for logged-in users
        if (window.authManager.isLoggedIn() && form.querySelector('input[name="saveAddress"]').checked) {
            try {
                window.authManager.addAddress(this.checkoutData.shipping);
            } catch (error) {
                console.error('Error saving address:', error);
            }
        }
    }

    // Save payment data (securely - don't store actual payment info)
    savePaymentData() {
        const form = document.getElementById('payment-form');
        const cardNumber = form.querySelector('input[name="cardNumber"]').value.trim();
        
        this.checkoutData.payment = {
            cardType: this.detectCardType(cardNumber),
            lastFourDigits: cardNumber.slice(-4),
            cardholderName: form.querySelector('input[name="cardholderName"]').value.trim()
        };
    }

    // Pre-fill step data
    prefillStepData(step) {
        switch (step) {
            case 1:
                this.prefillCustomerForm();
                break;
            case 2:
                this.prefillShippingForm();
                break;
            case 4:
                this.updateOrderSummary();
                break;
        }
    }

    // Pre-fill customer form
    prefillCustomerForm() {
        const form = document.getElementById('customer-form');
        const data = this.checkoutData.customer;
        
        if (form && data) {
            const fields = ['firstName', 'lastName', 'email', 'phone'];
            fields.forEach(field => {
                const input = form.querySelector(`input[name="${field}"]`);
                if (input && data[field]) {
                    input.value = data[field];
                }
            });
        }
    }

    // Pre-fill shipping form
    prefillShippingForm() {
        const form = document.getElementById('shipping-form');
        const data = this.checkoutData.shipping;
        
        if (form && data) {
            const fields = ['address', 'city', 'state', 'zipCode'];
            fields.forEach(field => {
                const input = form.querySelector(`input[name="${field}"]`);
                if (input && data[field]) {
                    input.value = data[field];
                }
            });
            
            const countrySelect = form.querySelector('select[name="country"]');
            if (countrySelect && data.country) {
                countrySelect.value = data.country;
            }
        }
    }

    // Update order summary
    updateOrderSummary() {
        const summaryContainer = document.getElementById('order-summary-items');
        const subtotalElement = document.getElementById('summary-subtotal');
        const shippingElement = document.getElementById('summary-shipping');
        const taxElement = document.getElementById('summary-tax');
        const totalElement = document.getElementById('summary-total');
        
        if (summaryContainer) {
            summaryContainer.innerHTML = '';
            this.checkoutData.order.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'summary-item';
                itemElement.innerHTML = `
                    <div class="summary-item-info">
                        <span class="item-name">${item.product.name}</span>
                        <span class="item-details">Size: ${item.size}, Qty: ${item.quantity}</span>
                    </div>
                    <span class="item-price">$${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                `;
                summaryContainer.appendChild(itemElement);
            });
        }
        
        if (subtotalElement) subtotalElement.textContent = `$${this.checkoutData.order.subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${this.checkoutData.order.shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${this.checkoutData.order.tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${this.checkoutData.order.total.toFixed(2)}`;
    }

    // Place order
    async placeOrder() {
        try {
            // Validate all data one more time
            if (!this.validateAllData()) {
                return false;
            }
            
            // Create order object
            const order = {
                ...this.checkoutData,
                orderId: this.generateOrderId(),
                timestamp: new Date().toISOString(),
                status: 'confirmed'
            };
            
            // Save order for logged-in users
            if (window.authManager.isLoggedIn()) {
                window.authManager.addOrder(order);
            }
            
            // Show success message
            this.showOrderSuccess(order);
            
            // Clear cart
            window.cart.clearCart();
            
            return true;
        } catch (error) {
            this.showError('Failed to place order. Please try again.');
            return false;
        }
    }

    // Show order success
    showOrderSuccess(order) {
        const successElement = document.getElementById('order-success');
        const orderIdElement = document.getElementById('success-order-id');
        
        if (successElement) {
            successElement.classList.remove('hidden');
            if (orderIdElement) {
                orderIdElement.textContent = order.orderId;
            }
        }
        
        // Hide checkout steps and navigation
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = document.getElementById(`checkout-step-${i}`);
            if (stepElement) stepElement.classList.add('hidden');
        }
        
        const navigation = document.getElementById('checkout-navigation');
        if (navigation) navigation.style.display = 'none';
        
        window.cart.showToast('Order placed successfully!');
    }

    // Validate all checkout data
    validateAllData() {
        return this.checkoutData.customer.firstName &&
               this.checkoutData.customer.lastName &&
               this.checkoutData.customer.email &&
               this.checkoutData.shipping.address &&
               this.checkoutData.shipping.city &&
               this.checkoutData.payment.cardholderName;
    }

    // Calculate shipping cost
    calculateShipping(subtotal) {
        if (subtotal >= 200) return 0; // Free shipping over $200
        if (subtotal >= 100) return 15; // Reduced shipping $100-$199
        return 25; // Standard shipping under $100
    }

    // Calculate tax
    calculateTax(subtotal) {
        return subtotal * 0.08; // 8% tax rate
    }

    // Generate order ID
    generateOrderId() {
        const prefix = 'BRV';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Card validation functions
    validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
    }

    validateExpiryDate(expiryDate) {
        const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const now = new Date();
        const expiry = new Date(year, month - 1);
        
        return month >= 1 && month <= 12 && expiry > now;
    }

    validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    detectCardType(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'American Express';
        return 'Unknown';
    }

    // Show error message
    showError(message) {
        window.cart.showToast(message);
    }
}

// Initialize checkout manager
window.checkoutManager = new CheckoutManager();