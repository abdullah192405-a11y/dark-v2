// test-article-table.js
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function testArticleTable() {
  try {
    // Try to count articles
    const count = await prisma.article.count();
    console.log('✅ Article table exists! Current count:', count);
    
    // Try to create a test article
    const article = await prisma.article.create({
      data: {
        title: 'Test Article',
        slug: 'test-article-' + Date.now(),
        content: 'This is a test article',
        published: false
      }
    });
    console.log('✅ Test article created:', article.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testArticleTable();