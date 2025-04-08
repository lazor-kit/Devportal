import seed from "./seed";
import { log } from "./vite";

async function runSeed() {
  try {
    await seed();
    log("Database seeded successfully", "seed-script");
    process.exit(0);
  } catch (error) {
    log(`Error seeding database: ${error}`, "seed-script");
    process.exit(1);
  }
}

runSeed();