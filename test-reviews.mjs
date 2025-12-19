import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function testReviews() {
  try {
    // Count reviews
    const count = await prisma.review.count();
    console.log('✅ Review table exists! Current count:', count);

    if (count > 0) {
      // Get all reviews
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      console.log('✅ Recent reviews:', reviews);
    } else {
      console.log('❌ No reviews found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testReviews();
