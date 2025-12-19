import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function checkExactSpelling() {
  try {
    console.log('🔍 Checking exact spelling in database...\n');
    
    const car = await db.car.findFirst({
      where: { status: "AVAILABLE" },
      select: {
        make: true,
        model: true,
        description: true
      }
    });
    
    if (car) {
      console.log('📋 Exact database values:');
      console.log(`Make: "${car.make}" (length: ${car.make.length})`);
      console.log(`Model: "${car.model}" (length: ${car.model.length})`);
      console.log('');
      
      // Character by character analysis
      console.log('🔤 Character analysis of model:');
      for (let i = 0; i < car.model.length; i++) {
        const char = car.model[i];
        const charCode = char.charCodeAt(0);
        console.log(`Position ${i}: "${char}" (Unicode: ${charCode})`);
      }
      
      console.log('\n🔤 What "هايلكس" should be:');
      const target = "هايلكس";
      for (let i = 0; i < target.length; i++) {
        const char = target[i];
        const charCode = char.charCodeAt(0);
        console.log(`Position ${i}: "${char}" (Unicode: ${charCode})`);
      }
      
      console.log('\n🔤 What "هايلوكس" would be:');
      const source = "هايلوكس";
      for (let i = 0; i < source.length; i++) {
        const char = source[i];
        const charCode = char.charCodeAt(0);
        console.log(`Position ${i}: "${char}" (Unicode: ${charCode})`);
      }
      
      // Test different searches
      console.log('\n🔍 Testing searches:');
      
      // Search for exact database value
      const exactMatch = await db.car.findMany({
        where: {
          model: { contains: car.model, mode: "insensitive" }
        }
      });
      console.log(`Searching for "${car.model}": ${exactMatch.length} matches`);
      
      // Search for corrected version
      const correctedMatch = await db.car.findMany({
        where: {
          model: { contains: "هايلكس", mode: "insensitive" }
        }
      });
      console.log(`Searching for "هايلكس": ${correctedMatch.length} matches`);
      
      // Search for original version
      const originalMatch = await db.car.findMany({
        where: {
          model: { contains: "هايلوكس", mode: "insensitive" }
        }
      });
      console.log(`Searching for "هايلوكس": ${originalMatch.length} matches`);
      
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

checkExactSpelling();