import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  try {
    // Delete existing banks
    await db.bank.deleteMany({});
    console.log('✓ Deleted existing banks');

    // Add sample banks with interest rates
    const banks = await db.bank.createMany({
      data: [
        {
          name: 'البنك الأهلي',
          logoImage: 'https://via.placeholder.com/150?text=AL-AHLI',
          interestRate: 4.5,
          loanPolicy: 'قرض شخصي بدون ضامن، مع إمكانية السداد المبكر بدون رسوم إضافية.',
        },
        {
          name: 'بنك الراجحي',
          logoImage: 'https://via.placeholder.com/150?text=AL-RAJHI',
          interestRate: 4.0,
          loanPolicy: 'قرض إسلامي متوافق مع الشريعة، يتطلب ضامن واحد على الأقل.',
        },
        {
          name: 'بنك الرياض',
          logoImage: 'https://via.placeholder.com/150?text=AL-RIYADH',
          interestRate: 4.75,
          loanPolicy: 'قرض مرن مع خيارات سداد متعددة، يتطلب تقديم كشف حساب مصرفي.',
        },
        {
          name: 'بنك سامبا',
          logoImage: 'https://via.placeholder.com/150?text=SAMBA',
          interestRate: 4.25,
          loanPolicy: 'قرض سريع للموظفين، مع إمكانية التمديد لمدة إضافية.',
        },
        {
          name: 'بنك الإمارات الإسلامي',
          logoImage: 'https://via.placeholder.com/150?text=ABANK',
          interestRate: 3.9,
          loanPolicy: 'قرض إسلامي بدون فوائد، يعتمد على نظام المرابحة.',
        },
      ],
    });

    console.log('✓ Added 5 banks successfully');
    
    // Fetch and display all banks
    const allBanks = await db.bank.findMany();
    console.log('\nAll Banks:');
    allBanks.forEach((bank) => {
      console.log(`  - ${bank.name}: ${bank.interestRate}%`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

main();
