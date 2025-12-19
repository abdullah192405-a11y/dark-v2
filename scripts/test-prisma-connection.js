import pkg from "../src/generated/prisma/index.js";
const { PrismaClient } = pkg;

async function main() {
  const prisma = new PrismaClient();
  try {
    // Attempt to fetch one Bank record just to test connection
    const bankCount = await prisma.bank.count();
    console.log("Connection test successful. Bank records count:", bankCount);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
