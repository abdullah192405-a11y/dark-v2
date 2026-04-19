
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const heroSection = await prisma.heroSection.findFirst();
  console.log('Hero Section Data:', JSON.stringify(heroSection, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
