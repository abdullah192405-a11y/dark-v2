const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting branding update...");

  // 1. Update logos in database
  const logoTypes = ["main", "navbar", "footer", "favicon"];
  
  for (const type of logoTypes) {
    // Update existing active logos of this type
    await prisma.logo.updateMany({
      where: { type },
      data: { 
        imageUrl: "/logo.JPG",
        altText: "ماكس موتورز - MaxMotors",
        isActive: true 
      }
    });
    
    // Check if any logo of this type exists
    const existing = await prisma.logo.findFirst({ where: { type } });
    if (!existing) {
      await prisma.logo.create({
        data: {
          type,
          imageUrl: "/logo.JPG",
          altText: "ماكس موتورز - MaxMotors",
          isActive: true
        }
      });
      console.log(`Created new logo for type: ${type}`);
    } else {
      console.log(`Updated existing logos for type: ${type}`);
    }
  }

  // 2. Update store info
  const storeInfo = await prisma.storeInfo.findFirst();
  if (storeInfo) {
    await prisma.storeInfo.update({
      where: { id: storeInfo.id },
      data: {
        name: "ماكس موتورز",
        description: "ماكس موتورز - أفضل منصة لشراء وبيع السيارات في السعودية",
        email: "info@maxmotors.sa"
      }
    });
    console.log("Updated store info");
  } else {
    await prisma.storeInfo.create({
      data: {
        name: "ماكس موتورز",
        description: "ماكس موتورز - أفضل منصة لشراء وبيع السيارات في السعودية",
        email: "info@maxmotors.sa",
        address: "الرياض، المملكة العربية السعودية",
        city: "الرياض",
        country: "السعودية",
        phone: "+966 123 456 789"
      }
    });
    console.log("Created store info");
  }

  console.log("Branding update completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
