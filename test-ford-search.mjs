import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function searchForFord() {
  try {
    console.log('Searching for Ford cars...\n');
    
    // Search 1: Direct search
    const fordCars1 = await db.car.findMany({
      where: {
        status: 'AVAILABLE',
        make: { contains: 'ford', mode: 'insensitive' }
      }
    });
    
    console.log('Search 1 (make contains "ford"):', fordCars1.length);
    if (fordCars1.length > 0) {
      fordCars1.forEach(car => {
        console.log(`  - ${car.make} ${car.model} ${car.year}`);
      });
    }
    
    // Search 2: All available cars with "ford" in any field
    const allCars = await db.car.findMany({
      where: { status: 'AVAILABLE' },
      select: { id: true, make: true, model: true, year: true }
    });
    
    console.log('\nAll available cars:');
    allCars.forEach(car => {
      console.log(`  ${car.make} ${car.model} ${car.year}`);
    });
    
    // Check for Ford specifically
    const fordMatch = allCars.filter(car => 
      car.make.toLowerCase().includes('ford')
    );
    
    console.log(`\nCars with "ford" in make: ${fordMatch.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

searchForFord();
