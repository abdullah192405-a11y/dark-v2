import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

try {
  const reviews = await db.review.findMany();
  console.log('Total reviews in new database:', reviews.length);
  console.log('\nReviews:');
  reviews.forEach((r, i) => {
    console.log(`${i+1}. Name: ${r.clientName}, City: ${r.city}, Car: ${r.car}`);
    console.log(`   Review: ${r.reviewText.substring(0, 50)}...`);
    console.log();
  });
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await db.$disconnect();
}
