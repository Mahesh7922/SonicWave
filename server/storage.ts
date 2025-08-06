import { 
  type Product, 
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type User,
  type InsertUser,
  type LoginData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  
  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<void>;
  removeFromCart(sessionId: string, productId: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string, paymentIntentId?: string): Promise<void>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private users: Map<string, User>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.users = new Map();
    
    // Initialize with demo products
    this.initializeProducts();
  }

  private initializeProducts() {
    const demoProducts: Product[] = [
      {
        id: "1",
        name: "SonicWave Pro Max",
        price: "399.00",
        description: "Flagship model with premium noise cancellation and superior sound quality",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Premium",
        stock: 50,
        featured: true,
      },
      {
        id: "2",
        name: "SonicWave Gaming Elite",
        price: "299.00",
        description: "Ultimate gaming experience with 7.1 surround sound and RGB lighting",
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Gaming",
        stock: 30,
        featured: true,
      },
      {
        id: "3",
        name: "SonicWave Studio",
        price: "199.00",
        description: "Professional studio-grade monitoring headphones for audio production",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Studio",
        stock: 25,
        featured: false,
      },
      {
        id: "4",
        name: "SonicWave Wireless",
        price: "249.00",
        description: "True wireless freedom with premium sound quality and long battery life",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Wireless",
        stock: 40,
        featured: true,
      },
      {
        id: "5",
        name: "SonicWave Sport",
        price: "149.00",
        description: "Built for active lifestyles with sweat resistance and secure fit",
        image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Sport",
        stock: 35,
        featured: false,
      },
      {
        id: "6",
        name: "SonicWave Classic",
        price: "99.00",
        description: "Timeless design with modern performance and exceptional comfort",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800",
        category: "Classic",
        stock: 60,
        featured: false,
      }
    ];

    demoProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    }));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId);
    
    if (existingItem) {
      existingItem.quantity += insertItem.quantity || 1;
      return existingItem;
    }

    const id = randomUUID();
    const item: CartItem = { ...insertItem, id, quantity: insertItem.quantity || 1 };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<void> {
    const item = Array.from(this.cartItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.cartItems.delete(item.id);
      } else {
        item.quantity = quantity;
      }
    }
  }

  async removeFromCart(sessionId: string, productId: string): Promise<void> {
    const item = Array.from(this.cartItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);
    
    if (item) {
      this.cartItems.delete(item.id);
    }
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    itemsToRemove.forEach(item => {
      this.cartItems.delete(item.id);
    });
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: insertOrder.status || "pending",
      customerEmail: insertOrder.customerEmail || null,
      customerName: insertOrder.customerName || null,
      paymentIntentId: insertOrder.paymentIntentId || null,
      shippingAddress: insertOrder.shippingAddress || null,
      createdAt: new Date().toISOString() 
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const item: OrderItem = { ...insertItem, id };
    this.orderItems.set(id, item);
    return item;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string, paymentIntentId?: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      if (paymentIntentId) {
        order.paymentIntentId = paymentIntentId;
      }
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    // In memory implementation - find orders where user session matches or customerEmail matches user email
    const user = this.users.get(userId);
    if (!user) return [];
    
    return Array.from(this.orders.values()).filter(order => 
      order.customerEmail === user.email
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
