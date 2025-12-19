import { db } from './src/lib/prisma.js';

async function updatePhoneField() {
  try {
    console.log('Updating users with null phone field...');

    const result = await db.User.updateMany({
      where: {
        phone: null,
      },
      data: {
        phone: '', // Set empty string as default
      },
    });

    console.log(`Updated ${result.count} users with default phone value`);
  } catch (error) {
    console.error('Error updating phone field:', error);
    process.exit(1);
  }
}

updatePhoneField();
