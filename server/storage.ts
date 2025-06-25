import { users, products, cartItems, newsletterSubscriptions, type User, type InsertUser, type LoginUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type InsertNewsletter } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart methods
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Newsletter methods
  subscribeNewsletter(subscription: InsertNewsletter): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private newsletters: Map<number, InsertNewsletter>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartId: number;
  private currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.newsletters = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartId = 1;
    this.currentNewsletterId = 1;
    
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: Omit<Product, 'id' | 'createdAt'>[] = [
      {
        name: "Elegant Silk Blouse",
        description: "Luxurious silk blouse with contemporary tailoring and elegant drape.",
        price: "289.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1564257577-d18f494f8fdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: true
      },
      {
        name: "Classic Tailored Blazer",
        description: "Perfectly tailored blazer crafted from premium wool blend.",
        price: "459.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: false
      },

      {
        name: "Premium Dress Shirt",
        description: "Crisp cotton dress shirt with impeccable attention to detail.",
        price: "225.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: false
      },

      {
        name: "Wool Trench Coat",
        description: "Classic trench coat in premium wool with timeless silhouette.",
        price: "789.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: false
      },

      {
        name: "Tailored Suit Jacket",
        description: "Impeccably tailored suit jacket in fine Italian wool.",
        price: "649.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: false
      },
      {
        name: "Silk Evening Dress",
        description: "Stunning silk evening dress with elegant draping and timeless appeal.",
        price: "899.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1566479179817-c0ae25c08b05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: true
      },
      {
        name: "Leather Chelsea Boots",
        description: "Handcrafted leather Chelsea boots with superior comfort and style.",
        price: "349.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["7", "8", "9", "10", "11", "12"],
        bestseller: false,
        featured: false
      },

      {
        name: "Cashmere Sweater",
        description: "Luxurious cashmere sweater with classic fit and superior softness.",
        price: "429.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: false
      },

      {
        name: "Wool Midi Skirt",
        description: "Sophisticated wool midi skirt with A-line silhouette.",
        price: "289.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: false
      },

      {
        name: "Leather Jacket",
        description: "Premium leather jacket with modern cut and timeless appeal.",
        price: "899.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1558882224-dda166733046?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: true
      }
    ];

    initialProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, {
        ...product,
        id,
        createdAt: new Date()
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getBestSellers(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.bestseller
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
    
    return userCartItems.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return { ...item, product };
    });
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => 
        item.userId === cartItem.userId &&
        item.productId === cartItem.productId &&
        item.size === cartItem.size
    );

    if (existingItem) {
      existingItem.quantity += cartItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentCartId++;
    const newCartItem: CartItem = {
      id,
      userId: cartItem.userId || null,
      productId: cartItem.productId,
      size: cartItem.size,
      quantity: cartItem.quantity || 1,
      createdAt: new Date()
    };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    
    userItems.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
    
    return true;
  }

  async subscribeNewsletter(subscription: InsertNewsletter): Promise<boolean> {
    // Check if email already exists
    const exists = Array.from(this.newsletters.values()).some(
      (sub) => sub.email === subscription.email
    );
    
    if (exists) return false;
    
    const id = this.currentNewsletterId++;
    this.newsletters.set(id, subscription);
    return true;
  }
}

export const storage = new MemStorage();
