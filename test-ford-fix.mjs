import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function testFordSearch() {
  try {
    console.log('Testing Ford search with new logic...\n');
    
    const query = 'فورد';
    const searchTerms = query.toLowerCase();
    
    const whereConditions = {
      status: "AVAILABLE",
      OR: []
    };
    
    const carMakes = [
      { ar: ["فورد"], en: "ford" },
    ];
    
    carMakes.forEach(({ ar, en }) => {
      const matchesArabic = ar.some(arabicName => searchTerms.includes(arabicName));
      const matchesEnglish = searchTerms.includes(en.toLowerCase());
      
      if (matchesArabic || matchesEnglish) {
        console.log(`✅ Matched: ${en}`);
        // Search for BOTH Arabic and English
        whereConditions.OR.push(
          { make: { contains: en, mode: "insensitive" } }, // English
          ...ar.map(arabicName => ({ make: { contains: arabicName, mode: "insensitive" } })) // Arabic
        );
      }
    });
    
    console.log('Search conditions:', JSON.stringify(whereConditions, null, 2));
    
    const finalWhereConditions = { status: "AVAILABLE" };
    if (whereConditions.OR.length > 0) {
      finalWhereConditions.OR = whereConditions.OR;
    }
    
    const cars = await db.car.findMany({
      where: finalWhereConditions,
      select: {
        make: true,
        model: true,
        year: true,
        price: true,
      }
    });
    
    console.log(`\nFound ${cars.length} cars:`);
    cars.forEach(car => {
      console.log(`  - ${car.make} ${car.model} ${car.year} - $${car.price}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

testFordSearch();
