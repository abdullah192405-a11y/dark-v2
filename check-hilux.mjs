import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function findHiluxCars() {
  try {
    console.log('🔍 Searching for Hilux cars...');
    
    // Search for Hilux cars using different possible spellings
    const cars = await db.car.findMany({
      where: {
        OR: [
          { make: { contains: 'toyota', mode: 'insensitive' } },
          { model: { contains: 'hilux', mode: 'insensitive' } },
          { model: { contains: 'هايلكس', mode: 'insensitive' } },
          { model: { contains: 'هايلوكس', mode: 'insensitive' } },
          { description: { contains: 'hilux', mode: 'insensitive' } },
          { description: { contains: 'هايلكس', mode: 'insensitive' } },
          { description: { contains: 'هايلوكس', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        price: true,
        status: true,
        description: true
      }
    });
    
    console.log(`✅ Found ${cars.length} Hilux-related cars:`);
    cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.make} ${car.model} (${car.year})`);
      console.log(`   Price: $${car.price}`);
      console.log(`   Status: ${car.status}`);
      console.log(`   Description: ${car.description.substring(0, 80)}...`);
      console.log('');
    });
    
    // Also search for all Toyota cars
    const toyotaCars = await db.car.findMany({
      where: {
        make: { contains: 'toyota', mode: 'insensitive' }
      },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        status: true
      }
    });
    
    console.log(`\n📊 All Toyota cars in database (${toyotaCars.length} total):`);
    toyotaCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.make} ${car.model} (${car.year}) - Status: ${car.status}`);
    });
    
    // Count total cars
    const totalCars = await db.car.count();
    console.log(`\n📈 Total cars in database: ${totalCars}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

findHiluxCars();