import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  productSubmissionSchema, 
  productUpdateSchema,
  productStatus,
  type ProductSubmission
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Buffer } from 'buffer';

// The secret should be in an environment variable in a real app
const JWT_SECRET = "dev-showcase-secret-key";

// JWT token middleware
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    
    // @ts-ignore
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req: Request, res: Response, next: Function) => {
  // @ts-ignore
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID' });
  }

  const user = await storage.getUser(userId);
  
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  
  next();
};

// Base64 image handling
function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

function getImageExtensionFromBase64(base64: string): string {
  const match = base64.match(/^data:image\/([a-zA-Z]+);base64,/);
  return match ? match[1] : 'png';
}

// Helper function to handle validation errors
function handleValidationError(err: any, res: Response) {
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ message: validationError.message });
  }
  return res.status(500).json({ message: 'Server error' });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  // 1. Authentication
  app.post('/api/login', async (req, res) => {
    try {
      const data = loginScÏÏhema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // In a real app, you'd compare hashed passwords
      // In this mock app, we'll compare plain text for simplicity
      if (user.password !== data.password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (err) {
      return handleValidationError(err, res);
    }
  });

  // 2. Product routes
  // Get all approved products
  app.get('/api/products', async (req, res) => {
    try {
      const tag = req.query.tag as string;
      const search = req.query.search as string;
      
      let products;
      if (tag) {
        products = await storage.getProductsByTag(tag);
      } else if (search) {
        products = await storage.searchProducts(search);
      } else {
        products = await storage.getApprovedProducts();
      }
      
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Get a single product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Submit a new product
  app.post('/api/products', async (req, res) => {
    try {
      const data = productSubmissionSchema.parse(req.body);
      
      // Handle the base64 image data
      // In a real app, you'd upload this to a cloud storage service
      // Here we'll just store the base64 data
      if (!isBase64Image(data.image)) {
        return res.status(400).json({ message: 'Invalid image format. Must be a base64 encoded image.' });
      }

      // Create the product without terms field
      const { termsAccepted, ...productData } = data;
      const product = await storage.createProduct(productData);
      
      return res.status(201).json(product);
    } catch (err) {
      return handleValidationError(err, res);
    }
  });

  // 3. Admin routes
  // Get all products (for admin)
  app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      
      let products;
      if (status) {
        products = await storage.getProductsByStatus(status);
      } else {
        products = await storage.getAllProducts();
      }
      
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Update product status (approve/reject)
  app.patch('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const data = productUpdateSchema.parse({ ...req.body, id });
      
      const product = await storage.updateProductStatus(id, data.status);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (err) {
      return handleValidationError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
