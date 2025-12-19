import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function testHiluxSearch() {
  try {
    console.log('🔍 Testing Hilux search with different queries...\n');
    
    const query = "هايلوكس";
    console.log(`Searching for: "${query}"`);
    
    // Test the exact search that the chatbot uses
    const whereConditions = {
      status: "AVAILABLE",
      AND: [
        {
          OR: [
            { make: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { color: { contains: query, mode: "insensitive" } },
          ]
        }
      ]
    };
    
    console.log('Search conditions:', JSON.stringify(whereConditions, null, 2));
    
    const cars = await db.car.findMany({
      where: whereConditions,
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        price: true,
        description: true,
        color: true,
        status: true
      }
    });
    
    console.log(`\n✅ Found ${cars.length} cars with current search logic`);
    if (cars.length > 0) {
      cars.forEach(car => {
        console.log(`- ${car.make} ${car.model} (${car.year}) - $${car.price}`);
      });
    }
    
    // Test simpler search
    console.log('\n🔍 Testing simpler search...');
    const simpleCars = await db.car.findMany({
      where: {
        status: "AVAILABLE",
        OR: [
          { make: { contains: "هايلوكس", mode: "insensitive" } },
          { model: { contains: "هايلوكس", mode: "insensitive" } },
        ]
      }
    });
    
    console.log(`Found ${simpleCars.length} cars with simple search`);
    if (simpleCars.length > 0) {
      simpleCars.forEach(car => {
        console.log(`- ${car.make} ${car.model} (${car.year}) - $${car.price}`);
      });
    }
    
    // Get the actual car to see exact values
    console.log('\n📋 Getting actual car data...');
    const allCars = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: {
        id: true,
        make: true,
        model: true,
        description: true
      }
    });
    
    allCars.forEach(car => {
      console.log(`Make: "${car.make}"`);
      console.log(`Model: "${car.model}"`);
      console.log(`Description snippet: "${car.description.substring(0, 50)}..."`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testHiluxSearch();