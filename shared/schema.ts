import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define available tags for products
export const availableTags = [
  "defi",
  "payment",
  "nft",
  "dao",
  "gaming",
  "wallet",
  "governance",
  "marketplace",
  "other"
] as const;

export const productStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// Users table (for admin)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  githubLink: text("github_link").notNull(),
  demoLink: text("demo_link").notNull(),
  tags: text("tags").array().notNull(),
  status: text("status").notNull().default(productStatus.PENDING),
  submittedBy: text("submitted_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  image: true,
  githubLink: true,
  demoLink: true,
  tags: true,
  submittedBy: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const productSubmissionSchema = insertProductSchema.extend({
  tags: z.array(z.enum(availableTags)).min(1, "At least one tag is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  githubLink: z.string().url("Must be a valid URL"),
  demoLink: z.string().url("Must be a valid URL"),
  image: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const productUpdateSchema = z.object({
  id: z.number(),
  status: z.enum([productStatus.APPROVED, productStatus.REJECTED]),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductSubmission = z.infer<typeof productSubmissionSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductTag = typeof availableTags[number];
export type ProductStatus = typeof productStatus[keyof typeof productStatus];
