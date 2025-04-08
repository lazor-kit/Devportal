import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define available tags for dApps
export const availableTags = [
  "defi",
  "payment",
  "nft",
  "dao",
  "gaming",
  "wallet",
  "governance",
  "marketplace",
  "social",
  "tools",
  "infrastructure",
  "other"
] as const;

export const dappStatus = {
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

// dApps table
export const dapps = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  githubLink: text("github_link").notNull(),
  demoLink: text("demo_link").notNull(),
  twitterLink: text("twitter_link"),
  tags: text("tags").array().notNull(),
  status: text("status").notNull().default(dappStatus.PENDING),
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

export const insertDappSchema = createInsertSchema(dapps).pick({
  name: true,
  description: true,
  image: true,
  githubLink: true,
  demoLink: true,
  twitterLink: true,
  tags: true,
  submittedBy: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const dappSubmissionSchema = insertDappSchema.extend({
  tags: z.array(z.enum(availableTags)).min(1, "At least one tag is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  githubLink: z.string().url("Must be a valid URL"),
  demoLink: z.string().url("Must be a valid URL"),
  twitterLink: z.string().url("Must be a valid URL").optional(),
  image: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const dappUpdateSchema = z.object({
  id: z.number(),
  status: z.enum([dappStatus.APPROVED, dappStatus.REJECTED]),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDapp = z.infer<typeof insertDappSchema>;
export type User = typeof users.$inferSelect;
export type Dapp = typeof dapps.$inferSelect;
export type DappSubmission = z.infer<typeof dappSubmissionSchema>;
export type Login = z.infer<typeof loginSchema>;
export type DappUpdate = z.infer<typeof dappUpdateSchema>;
export type DappTag = typeof availableTags[number];
export type DappStatus = typeof dappStatus[keyof typeof dappStatus];

// For backwards compatibility (refactoring gradually)
export const productSubmissionSchema = dappSubmissionSchema;
export const productUpdateSchema = dappUpdateSchema;
export type InsertProduct = InsertDapp;
export type Product = Dapp;
export type ProductSubmission = DappSubmission;
export type ProductUpdate = DappUpdate;
export type ProductTag = DappTag;
export type ProductStatus = DappStatus;
export const productStatus = dappStatus;
