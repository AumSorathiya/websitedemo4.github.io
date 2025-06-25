import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bravenza-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("bravenza-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("bravenza-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Update existing item
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [...prevItems, { product, size, quantity }];
      }
      
      return newItems;
    });

    // Show success toast
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: number, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setItems(prevItems =>
      prevItems.filter(item => !(item.product.id === productId && item.size === size))
    );
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("bravenza-cart");
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  }, [toast]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  }, [items]);

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
}
