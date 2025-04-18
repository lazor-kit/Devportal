import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, dapps, productStatus } from '@shared/schema';
import { log } from './vite';
import { eq } from 'drizzle-orm/expressions';

async function seed() {
  try {
    log('Starting database seeding...', 'seed');

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'));

    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      log('Creating admin user...', 'seed');

      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
      });

      log('Admin user created successfully', 'seed');
    } else {
      log('Admin user already exists, skipping creation', 'seed');
    }

    // Check if we have any dapps
    const existingDapps = await db.select().from(dapps);

    if (existingDapps.length === 0) {
      log('Creating sample dapps...', 'seed');

      // Sample dapps
      const sampleDapps = [
        {
          name: 'Crypto Payment Gateway',
          description:
            'A secure payment gateway that accepts multiple cryptocurrencies for e-commerce websites.',
          image:
            'https://static.cryptobriefing.com/wp-content/uploads/2021/08/28042550/raydium-defi-cover.jpg',
          githubLink: 'https://github.com/fakerepo/payment-gateway',
          demoLink: 'https://demo.fakepayment.crypto',
          twitterLink: 'https://twitter.com/cryptoPayGate',
          submittedBy: 'cryptoDev',
          tags: ['payment', 'defi'],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'NFT Marketplace',
          description:
            'A decentralized marketplace for creating, buying, and selling NFTs with low gas fees.',
          image:
            'https://vneconomics.com/wp-content/uploads/2024/02/Jupiter-la-gi.png',
          githubLink: 'https://github.com/fakerepo/nft-market',
          demoLink: 'https://demo.nftmarket.crypto',
          twitterLink: 'https://twitter.com/nftmarketplace',
          submittedBy: 'nftCreator',
          tags: ['nft', 'marketplace'],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'DeFi Yield Aggregator',
          description:
            'An aggregator that helps users find the best yield farming opportunities across multiple protocols.',
          image:
            'https://academy-public.coinmarketcap.com/srd-optimized-uploads/0b151eb965b1420fa4f018180f5a78da.webp',
          githubLink: 'https://github.com/fakerepo/yield-aggregator',
          demoLink: 'https://demo.yieldagg.finance',
          twitterLink: 'https://twitter.com/defiYieldAgg',
          submittedBy: 'defiDev',
          tags: ['defi', 'yield'],
          status: productStatus.APPROVED,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Crypto Portfolio Tracker',
          description:
            'A comprehensive tool to track your crypto portfolio across multiple wallets and exchanges.',
          image:
            'https://miro.medium.com/v2/resize:fit:1400/1*pgaaIvNGMZ9GkXmKpRicNQ.png',
          githubLink: 'https://github.com/fakerepo/portfolio-tracker',
          demoLink: 'https://demo.cryptofolio.app',
          twitterLink: 'https://twitter.com/cryptoPortfolio',
          submittedBy: 'trackerDev',
          tags: ['wallet', 'defi'],
          status: productStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Insert sample dapps
      for (const dapp of sampleDapps) {
        await db.insert(dapps).values(dapp);
      }

      log('Sample dapps created successfully', 'seed');
    } else {
      log('Dapps already exist, skipping creation', 'seed');
    }

    log('Database seeding completed successfully', 'seed');
  } catch (error) {
    log(`Error seeding database: ${error}`, 'seed');
    process.exit(1);
  }
}

export default seed;
