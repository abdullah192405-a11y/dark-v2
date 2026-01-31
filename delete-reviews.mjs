import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

try {
  // Delete all reviews
  const result = await db.review.deleteMany({});
  console.log(`Deleted ${result.count} reviews`);
  
  // Verify
  const remaining = await db.review.findMany();
  console.log(`Remaining reviews: ${remaining.length}`);
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await db.$disconnect();
}
