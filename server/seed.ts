import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, products, productStatus } from "@shared/schema";
import { log } from "./vite";
import { eq } from "drizzle-orm/expressions";

async function seed() {
  try {
    log("Starting database seeding...", "seed");

    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      log("Creating admin user...", "seed");
      
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        isAdmin: true,
      });
      
      log("Admin user created successfully", "seed");
    } else {
      log("Admin user already exists, skipping creation", "seed");
    }

    // Check if we have any products
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      log("Creating sample products...", "seed");
      
      // Sample products
      const sampleProducts = [
        {
          name: "Crypto Payment Gateway",
          description: "A secure payment gateway that accepts multiple cryptocurrencies for e-commerce websites.",
          image: "https://i.imgur.com/123fakeimage.jpg",
          githubLink: "https://github.com/fakerepo/payment-gateway",
          demoLink: "https://demo.fakepayment.crypto",
          submittedBy: "cryptoDev",
          tags: ["payment", "defi"],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          name: "NFT Marketplace",
          description: "A decentralized marketplace for creating, buying, and selling NFTs with low gas fees.",
          image: "https://i.imgur.com/456fakeimage.jpg",
          githubLink: "https://github.com/fakerepo/nft-market",
          demoLink: "https://demo.nftmarket.crypto",
          submittedBy: "nftCreator",
          tags: ["nft", "marketplace"],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: "DeFi Yield Aggregator",
          description: "An aggregator that helps users find the best yield farming opportunities across multiple protocols.",
          image: "https://i.imgur.com/789fakeimage.jpg",
          githubLink: "https://github.com/fakerepo/yield-aggregator",
          demoLink: "https://demo.yieldagg.finance",
          submittedBy: "defiDev",
          tags: ["defi", "yield"],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Crypto Portfolio Tracker",
          description: "A comprehensive tool to track your crypto portfolio across multiple wallets and exchanges.",
          image: "https://i.imgur.com/101fakeimage.jpg",
          githubLink: "https://github.com/fakerepo/portfolio-tracker",
          demoLink: "https://demo.cryptofolio.app",
          submittedBy: "trackerDev",
          tags: ["wallet", "defi"],
          status: productStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];
      
      // Insert sample products
      for (const product of sampleProducts) {
        await db.insert(products).values(product);
      }
      
      log("Sample products created successfully", "seed");
    } else {
      log("Products already exist, skipping creation", "seed");
    }

    log("Database seeding completed successfully", "seed");
  } catch (error) {
    log(`Error seeding database: ${error}`, "seed");
    process.exit(1);
  }
}

export default seed;