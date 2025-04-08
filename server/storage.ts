import {
  users,
  products,
  type User,
  type Product,
  type InsertUser,
  type InsertProduct,
  productStatus
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getApprovedProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByStatus(status: string): Promise<Product[]>;
  getProductsByTag(tag: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStatus(id: number, status: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private userCurrentId: number;
  private productCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.userCurrentId = 1;
    this.productCurrentId = 1;

    // Create default admin user
    this.createUser({
      username: "admin",
      password: "adminpass",
      isAdmin: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getApprovedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.status === productStatus.APPROVED
    );
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByStatus(status: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.status === status
    );
  }

  async getProductsByTag(tag: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.tags.includes(tag) && product.status === productStatus.APPROVED
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      status: productStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStatus(id: number, status: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct: Product = {
      ...product,
      status,
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTermLower = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        (product.name.toLowerCase().includes(searchTermLower) || 
         product.description.toLowerCase().includes(searchTermLower)) &&
        product.status === productStatus.APPROVED
    );
  }
}

export const storage = new MemStorage();
