import {
  users,
  dapps,
  type User,
  type Product,
  type InsertUser,
  type InsertProduct,
  productStatus
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc, sql, inArray } from "drizzle-orm";
import { log } from "./vite";

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error: any) {
      log(`Error in getUser: ${error}`, "storage");
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error: any) {
      log(`Error in getUserByUsername: ${error}`, "storage");
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error: any) {
      log(`Error in createUser: ${error}`, "storage");
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    try {
      const allProducts = await db
        .select()
        .from(dapps)
        .orderBy(desc(dapps.createdAt));
      return allProducts;
    } catch (error: any) {
      log(`Error in getAllProducts: ${error}`, "storage");
      return [];
    }
  }

  async getApprovedProducts(): Promise<Product[]> {
    try {
      const approvedProducts = await db
        .select()
        .from(dapps)
        .where(eq(dapps.status, productStatus.APPROVED))
        .orderBy(desc(dapps.createdAt));
      return approvedProducts;
    } catch (error: any) {
      log(`Error in getApprovedProducts: ${error}`, "storage");
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      const [product] = await db
        .select()
        .from(dapps)
        .where(eq(dapps.id, id));
      return product;
    } catch (error: any) {
      log(`Error in getProductById: ${error}`, "storage");
      return undefined;
    }
  }

  async getProductsByStatus(status: string): Promise<Product[]> {
    try {
      const filteredProducts = await db
        .select()
        .from(dapps)
        .where(eq(dapps.status, status))
        .orderBy(desc(dapps.createdAt));
      return filteredProducts;
    } catch (error: any) {
      log(`Error in getProductsByStatus: ${error}`, "storage");
      return [];
    }
  }

  async getProductsByTag(tag: string): Promise<Product[]> {
    try {
      // We need to find products where the tag is in the array of tags
      const filteredProducts = await db
        .select()
        .from(dapps)
        .where(
          and(
            eq(dapps.status, productStatus.APPROVED),
            sql`${tag} = ANY(${dapps.tags})`
          )
        )
        .orderBy(desc(dapps.createdAt));
      return filteredProducts;
    } catch (error: any) {
      log(`Error in getProductsByTag: ${error}`, "storage");
      return [];
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      // All new products start as pending
      const now = new Date();
      const productWithDefaults = {
        ...insertProduct,
        status: productStatus.PENDING,
        createdAt: now,
        updatedAt: now
      };
      
      const [product] = await db
        .insert(dapps)
        .values(productWithDefaults)
        .returning();
        
      return product;
    } catch (error: any) {
      log(`Error in createProduct: ${error}`, "storage");
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProductStatus(id: number, status: string): Promise<Product | undefined> {
    try {
      const now = new Date();
      const [updatedProduct] = await db
        .update(dapps)
        .set({ 
          status, 
          updatedAt: now 
        })
        .where(eq(dapps.id, id))
        .returning();
        
      return updatedProduct;
    } catch (error: any) {
      log(`Error in updateProductStatus: ${error}`, "storage");
      return undefined;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchTermLower = `%${query.toLowerCase()}%`;
      
      const searchResults = await db
        .select()
        .from(dapps)
        .where(
          and(
            eq(dapps.status, productStatus.APPROVED),
            or(
              like(sql`LOWER(${dapps.name})`, searchTermLower),
              like(sql`LOWER(${dapps.description})`, searchTermLower)
              // Note: For tags, we would need a more complex query
            )
          )
        )
        .orderBy(desc(dapps.createdAt));
        
      return searchResults;
    } catch (error: any) {
      log(`Error in searchProducts: ${error}`, "storage");
      return [];
    }
  }
}

// Initialize with database storage
export const storage = new DatabaseStorage();
