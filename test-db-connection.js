
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
    const hero = await prisma.heroSection.findFirst();
    console.log('✅ Success! Found hero section:', hero ? 'Yes' : 'No (table empty but connected)');
  } catch (e) {
    console.error('❌ Failed to connect:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
