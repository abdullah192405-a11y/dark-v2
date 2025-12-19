import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...\n');
    
    // Test 1: Count all cars
    const totalCars = await db.car.count();
    console.log('Total cars in database:', totalCars);
    
    // Test 2: Count available cars
    const availableCars = await db.car.count({
      where: { status: 'AVAILABLE' }
    });
    console.log('Available cars:', availableCars);
    
    // Test 3: Get sample cars
    const cars = await db.car.findMany({
      where: { status: 'AVAILABLE' },
      take: 3,
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        price: true,
        status: true,
        images: true,
      }
    });
    
    console.log('\nSample cars:');
    cars.forEach((car, index) => {
      console.log(`\n${index + 1}. ${car.make} ${car.model} (${car.year})`);
      console.log(`   Price: $${car.price}`);
      console.log(`   Status: ${car.status}`);
      console.log(`   Images: ${car.images ? car.images.length : 0}`);
    });
    
    // Test 4: Test search function
    console.log('\n\nTesting search for "audi"...');
    const audiCars = await db.car.findMany({
      where: {
        status: 'AVAILABLE',
        OR: [
          { make: { contains: 'audi', mode: 'insensitive' } }
        ]
      },
      take: 2
    });
    console.log('Audi cars found:', audiCars.length);
    if (audiCars.length > 0) {
      console.log('Sample:', audiCars[0].make, audiCars[0].model);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.$disconnect();
  }
}

testDatabase();
