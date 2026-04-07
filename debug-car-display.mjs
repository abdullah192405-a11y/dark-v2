import { PrismaClient } from './src/generated/prisma/index.js';

const db = new PrismaClient();

async function debugCarsDisplay() {
  try {
    console.log('🔍 DEBUG: Car Display vs Database Analysis\n');

    // Count all cars by status
    const carsByStatus = await db.car.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    console.log('📊 Cars by Status in Database:');
    console.log('─'.repeat(50));
    carsByStatus.forEach(group => {
      console.log(`  ${group.status}: ${group._count.id} cars`);
    });

    // Total cars
    const totalCars = await db.car.count();
    console.log(`\n  Total cars in database: ${totalCars}`);

    // Cars being displayed (AVAILABLE only)
    const displayedCars = await db.car.count({
      where: { status: 'AVAILABLE' }
    });
    console.log(`  Cars currently displayed: ${displayedCars} (AVAILABLE status only)`);

    // Hidden cars
    const hiddenCars = totalCars - displayedCars;
    console.log(`  Hidden cars: ${hiddenCars}`);

    console.log('\n📋 Sample Cars by Status:');
    console.log('─'.repeat(50));

    for (const status of ['AVAILABLE', 'UNAVAILABLE', 'SOLD']) {
      const samples = await db.car.findMany({
        where: { status },
        take: 3,
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          status: true
        }
      });

      if (samples.length > 0) {
        console.log(`\n${status} Status (${samples.length} shown):`);
        samples.forEach(car => {
          console.log(`  • ${car.make} ${car.model} (${car.year})`);
        });
      }
    }

    console.log('\n\n💡 The Issue:');
    console.log('─'.repeat(50));
    console.log(`Your frontend only displays cars with status "AVAILABLE"`);
    console.log(`Currently hiding ${hiddenCars} cars that have other statuses`);
    console.log(`(UNAVAILABLE, SOLD, etc.)\n`);

    console.log('📁 Files to check/modify:');
    console.log('  • src/actions/car-listing.js (line 118) - getCarsByFilters()');
    console.log('  • src/actions/car-listing.js (line 21) - getCarFilters()');
    console.log('  • src/actions/home.js - featured cars query');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

debugCarsDisplay();
