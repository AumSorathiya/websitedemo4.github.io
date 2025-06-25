import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-bravenza-charcoal border-gray-700" aria-describedby="empty-cart-description">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-playfair text-2xl">Shopping Cart</DialogTitle>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          <div className="text-center text-gray-400 py-12">
            <div id="empty-cart-description" className="sr-only">Your shopping cart is currently empty</div>
            <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
            <p>Your cart is empty</p>
            <Button 
              onClick={onClose}
              variant="link"
              className="text-bravenza-gold hover:text-white mt-2"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-bravenza-charcoal border-gray-700 max-h-[80vh] flex flex-col" aria-describedby="cart-items-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-playfair text-2xl">Shopping Cart</DialogTitle>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          <div id="cart-items-description" className="sr-only">Shopping cart items with quantity controls and remove options</div>
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="flex items-center space-x-4 py-4 border-b border-gray-700">
              <img 
                src={item.product.image} 
                alt={item.product.name} 
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-400">Size: {item.size}</p>
                <p className="text-bravenza-gold">${item.product.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-bravenza-gold transition-colors duration-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center hover:border-bravenza-gold transition-colors duration-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.product.id, item.size)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-playfair text-xl text-bravenza-gold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <Button 
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold transition-colors duration-300"
          >
            Proceed to Checkout - ${getTotalPrice().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
