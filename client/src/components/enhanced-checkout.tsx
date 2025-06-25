import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { X, CreditCard, Truck, Shield, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface EnhancedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedCheckout({ isOpen, onClose }: EnhancedCheckoutProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: ''
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const orderId = `BRV-${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Order Confirmed!",
      description: `Order #${orderId} has been placed successfully. You'll receive a confirmation email shortly.`,
    });

    clearCart();
    setIsProcessing(false);
    setCurrentStep(4);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '' });
    setShippingInfo({ address: '', city: '', state: '', zipCode: '', country: 'United States' });
    setPaymentInfo({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', cardName: '' });
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step < currentStep ? 'bg-green-500 text-white' :
            step === currentStep ? 'bg-bravenza-gold text-black' :
            'bg-gray-600 text-gray-300'
          }`}>
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-gray-600'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Customer Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={customerInfo.firstName}
            onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={customerInfo.lastName}
            onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
          className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
        />
      </div>
    </div>
  );

  const renderShippingInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
          className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={shippingInfo.state}
            onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={shippingInfo.country} onValueChange={(value) => setShippingInfo({...shippingInfo, country: value})}>
            <SelectTrigger className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-bravenza-dark border-gray-600">
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderPaymentInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Payment Information</h3>
      <div>
        <Label htmlFor="cardName">Cardholder Name</Label>
        <Input
          id="cardName"
          value={paymentInfo.cardName}
          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
          className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
        />
      </div>
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
          className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="expiryMonth">Month</Label>
          <Select value={paymentInfo.expiryMonth} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryMonth: value})}>
            <SelectTrigger className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent className="bg-bravenza-dark border-gray-600">
              {Array.from({length: 12}, (_, i) => (
                <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                  {String(i+1).padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiryYear">Year</Label>
          <Select value={paymentInfo.expiryYear} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryYear: value})}>
            <SelectTrigger className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold">
              <SelectValue placeholder="YYYY" />
            </SelectTrigger>
            <SelectContent className="bg-bravenza-dark border-gray-600">
              {Array.from({length: 10}, (_, i) => (
                <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                  {new Date().getFullYear() + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
            className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4">
        <Shield className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-bravenza-dark p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.product.name} ({item.size}) × {item.quantity}</span>
            <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-gray-600 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-bravenza-gold pt-2 border-t border-gray-600">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-medium mb-4">Order Confirmed!</h3>
      <p className="text-gray-400 mb-6">Thank you for shopping with BRAVENZA. Your order has been received and is being processed.</p>
      <div className="bg-bravenza-dark p-4 rounded-lg mb-6">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Payment Confirmed</span>
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            <span>Ships in 2-3 business days</span>
          </div>
        </div>
      </div>
      <Button onClick={handleClose} className="bg-bravenza-gold text-black hover:bg-bravenza-light-gold">
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl bg-bravenza-charcoal border-gray-700 max-h-[90vh] overflow-y-auto" aria-describedby="checkout-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-playfair text-2xl">
              {currentStep === 1 && 'Customer Information'}
              {currentStep === 2 && 'Shipping Details'}
              {currentStep === 3 && 'Payment & Review'}
              {currentStep === 4 && 'Order Confirmed'}
            </DialogTitle>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div id="checkout-description" className="sr-only">Complete your BRAVENZA purchase with secure checkout</div>

        {currentStep < 4 && renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && renderCustomerInfo()}
            {currentStep === 2 && renderShippingInfo()}
            {currentStep === 3 && renderPaymentInfo()}
            {currentStep === 4 && renderConfirmation()}
          </div>

          {currentStep < 4 && (
            <div className="lg:col-span-1">
              {renderOrderSummary()}
            </div>
          )}
        </div>

        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-gray-600 hover:border-bravenza-gold"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-bravenza-gold text-black hover:bg-bravenza-light-gold"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="bg-bravenza-gold text-black hover:bg-bravenza-light-gold"
              >
                {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}