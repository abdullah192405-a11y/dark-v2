import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

// نسخة مصححة من دالة التصحيح
const arabicSpellingVariations = {
  // أخطاء شائعة في كلمات السيارات (هايلوكس هو الإملاء الصحيح)
  "هايلكس": "هايلوكس",  // تصحيح للإملاء الصحيح
  "هايلوكز": "هايلوكس", 
  "هيلكس": "هايلوكس",
  "هيلوكس": "هايلوكس",
  "هاي لوكس": "هايلوكس",
  "هاي لكس": "هايلوكس",
  
  // أخطاء في ماركات السيارات
  "تويتا": "تويوتا",
  "تايوتا": "تويوتا",
  "تيوتا": "تويوتا",
  "تويته": "تويوتا",
  "تايوته": "تويوتا",
  "توتا": "تويوتا",  
  "تويت": "تويوتا", 
  "توياتا": "تويوتا", 
  "تاتا": "تويوتا", 
};

function correctArabicSpelling(text) {
  if (!text || typeof text !== 'string') return text;
  
  let correctedText = text;
  
  // ترتيب المفاتيح من الأطول إلى الأقصر لتجنب التداخل
  const sortedKeys = Object.keys(arabicSpellingVariations).sort((a, b) => b.length - a.length);
  
  sortedKeys.forEach(incorrect => {
    const correct = arabicSpellingVariations[incorrect];
    
    if (correctedText.includes(incorrect)) {
      if (/^[a-zA-Z]+$/.test(incorrect)) {
        const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
        correctedText = correctedText.replace(regex, correct);
      } else {
        correctedText = correctedText.split(incorrect).join(correct);
      }
    }
  });
  
  correctedText = correctedText.replace(/\s+/g, ' ').trim();
  return correctedText;
}

async function testCorrectedSearch() {
  try {
    console.log('🔍 Testing corrected search for "هايلوكس"...\n');
    
    const originalQuery = "هايلوكس";
    const correctedQuery = correctArabicSpelling(originalQuery);
    
    console.log(`📥 Original query: "${originalQuery}"`);
    console.log(`📤 Corrected query: "${correctedQuery}"`);
    console.log(`✏️ ${originalQuery === correctedQuery ? 'No correction needed' : 'Correction applied'}\n`);
    
    // Test the search with corrected query
    const cars = await db.car.findMany({
      where: {
        status: "AVAILABLE",
        OR: [
          { make: { contains: correctedQuery, mode: "insensitive" } },
          { model: { contains: correctedQuery, mode: "insensitive" } },
          { description: { contains: correctedQuery, mode: "insensitive" } },
        ]
      },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        price: true
      }
    });
    
    console.log(`✅ Found ${cars.length} cars with corrected search`);
    if (cars.length > 0) {
      cars.forEach(car => {
        console.log(`- ${car.make} ${car.model} (${car.year}) - $${car.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testCorrectedSearch();