import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { X, CreditCard, Truck, Shield } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderData = {
      orderId: `BRV-${Date.now()}`,
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        size: item.size,
        quantity: item.quantity,
        total: parseFloat(item.product.price) * item.quantity
      })),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      },
      totalAmount: getTotalPrice(),
      orderDate: new Date().toISOString()
    };

    console.log('Order processed:', orderData);
    
    setIsProcessing(false);
    setStep('success');
    clearCart();

    toast({
      title: "Order Confirmed!",
      description: `Your order #${orderData.orderId} has been placed successfully.`,
    });
  };

  const handleClose = () => {
    setStep('details');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-bravenza-charcoal border-gray-700 max-h-[90vh] overflow-y-auto" aria-describedby="checkout-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-playfair text-2xl">
              {step === 'details' && 'Shipping Details'}
              {step === 'payment' && 'Payment Information'}
              {step === 'success' && 'Order Confirmed'}
            </DialogTitle>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div id="checkout-description" className="sr-only">Complete your purchase with secure checkout</div>

        {step === 'details' && (
          <form onSubmit={handleSubmitDetails} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold">
              Continue to Payment
            </Button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="bg-bravenza-dark p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.product.name} ({item.size}) x {item.quantity}</span>
                    <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 font-medium">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="text-bravenza-gold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('details')}
                className="flex-1 border-gray-600 hover:border-bravenza-gold"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-bravenza-gold text-black hover:bg-bravenza-light-gold"
              >
                {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-playfair text-2xl font-medium mb-2">Order Confirmed!</h3>
            <p className="text-gray-400 mb-6">Thank you for shopping with BRAVENZA. Your order will be processed shortly.</p>
            
            <div className="bg-bravenza-dark p-4 rounded-lg mb-6 text-sm">
              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Payment Confirmed</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>2-3 Business Days</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleClose} className="bg-bravenza-gold text-black hover:bg-bravenza-light-gold">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}