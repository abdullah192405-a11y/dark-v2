import { db } from './src/lib/prisma.js';

async function testChatbotSearch() {
  try {
    console.log('=== Testing Chatbot Search Function ===\n');
    
    const testQueries = [
      "اودي",
      "Audi", 
      "هيونداي",
      "سيارات",
      "دفع رباعي",
    ];
    
    for (const query of testQueries) {
      console.log(`\n📝 Testing query: "${query}"`);
      const searchTerms = query.toLowerCase();
      
      const whereConditions = {
        status: "AVAILABLE",
        OR: []
      };
      
      // Car makes
      const carMakes = [
        { ar: ["اودي", "أودي"], en: "audi" },
        { ar: ["هيونداي", "هونداي"], en: "hyundai" },
        { ar: ["مرسيدس"], en: "mercedes" },
      ];
      
      carMakes.forEach(({ ar, en }) => {
        const matchesArabic = ar.some(arabicName => searchTerms.includes(arabicName));
        const matchesEnglish = searchTerms.includes(en.toLowerCase());
        
        if (matchesArabic || matchesEnglish) {
          console.log(`   ✅ Matched car make: ${en}`);
          whereConditions.OR.push({
            make: { contains: en, mode: "insensitive" }
          });
        }
      });
      
      // Body types
      const bodyTypes = [
        { ar: ["دفع رباعي"], en: "دفع رباعي" },
        { ar: ["سيدان"], en: "سيدان" },
      ];
      
      bodyTypes.forEach(({ ar, en }) => {
        const matchesArabic = ar.some(arabicName => searchTerms.includes(arabicName));
        
        if (matchesArabic) {
          console.log(`   ✅ Matched body type: ${en}`);
          whereConditions.OR.push({
            bodyType: { contains: en, mode: "insensitive" }
          });
        }
      });
      
      // General queries
      const generalCarQueries = ["سيارات", "سيارة", "cars", "car"];
      const isGeneralQuery = generalCarQueries.some(term => searchTerms.includes(term));
      
      if (whereConditions.OR.length === 0 && !isGeneralQuery) {
        whereConditions.OR = [
          { make: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
        ];
      }
      
      // Build final where
      const finalWhereConditions = { status: "AVAILABLE" };
      if (whereConditions.OR.length > 0) {
        finalWhereConditions.OR = whereConditions.OR;
      }
      
      // Execute search
      const cars = await db.car.findMany({
        where: finalWhereConditions,
        take: 3,
        select: {
          make: true,
          model: true,
          year: true,
          price: true,
        }
      });
      
      console.log(`   📊 Found ${cars.length} cars`);
      if (cars.length > 0) {
        cars.forEach((car, i) => {
          console.log(`      ${i + 1}. ${car.make} ${car.model} ${car.year} - $${car.price}`);
        });
      }
    }
    
    console.log('\n=== Test Complete ===\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

testChatbotSearch();
