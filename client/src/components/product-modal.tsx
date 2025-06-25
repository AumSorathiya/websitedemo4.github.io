import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Minus, Truck, RotateCcw, Shield } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize("");
      setQuantity(1);
    }
  }, [isOpen, product.id]);

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const size = selectedSize || product.sizes[0];
    addToCart(product, size, quantity);
    
    onClose();
  };

  const updateQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-bravenza-charcoal border-gray-700" aria-describedby="product-description">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full rounded-lg"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="font-playfair text-3xl font-medium mb-4">{product.name}</h2>
              <p className="text-2xl text-bravenza-gold mb-6">${product.price}</p>
              <p id="product-description" className="text-gray-300 mb-6">{product.description}</p>
            </div>
            
            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div>
                <h3 className="font-medium mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 border rounded text-sm transition-colors duration-300 ${
                        selectedSize === size
                          ? "border-bravenza-gold text-bravenza-gold"
                          : "border-gray-600 hover:border-bravenza-gold"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => updateQuantity(-1)}
                  className="w-10 h-10 border border-gray-600 rounded flex items-center justify-center hover:border-bravenza-gold transition-colors duration-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(1)}
                  className="w-10 h-10 border border-gray-600 rounded flex items-center justify-center hover:border-bravenza-gold transition-colors duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold transition-colors duration-300 py-3"
            >
              Add to Cart
            </Button>
            
            {/* Product Features */}
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                <span>Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Authenticity guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
