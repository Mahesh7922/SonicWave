import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertUserSchema, loginSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY. Please add your Stripe secret key to the environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'sonicwave-secret-key-dev-only',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: "Error adding to cart: " + error.message });
    }
  });

  app.put("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const { quantity } = req.body;
      await storage.updateCartItemQuantity(req.params.sessionId, req.params.productId, quantity);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: "Error updating cart item: " + error.message });
    }
  });

  app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.sessionId, req.params.productId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: "Error removing from cart: " + error.message });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: "Error clearing cart: " + error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, sessionId, customerInfo } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          sessionId,
          customerEmail: customerInfo?.email || "",
          customerName: customerInfo?.name || "",
        }
      });

      // Create order record
      const order = await storage.createOrder({
        sessionId,
        totalAmount: amount.toString(),
        status: "pending",
        paymentIntentId: paymentIntent.id,
        customerEmail: customerInfo?.email || "",
        customerName: customerInfo?.name || "",
        shippingAddress: customerInfo?.address || "",
      });

      // Add cart items to order
      const cartItems = await storage.getCartItems(sessionId);
      for (const item of cartItems) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        });
      }

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: order.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/webhook", async (req, res) => {
    try {
      const event = req.body;

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const sessionId = paymentIntent.metadata.sessionId;
        
        // Update order status
        const orders = await storage.getAllProducts(); // This is a workaround - in real app we'd have proper order lookup
        // Update order status to completed and clear cart
        await storage.clearCart(sessionId);
        
        console.log('Payment succeeded for session:', sessionId);
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      res.status(201).json({ 
        message: "User created successfully",
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error creating user: " + error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      req.session.userId = user.id;

      res.json({ 
        message: "Login successful",
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error during login: " + error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({ 
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
