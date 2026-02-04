
const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    const storeInfo = await prisma.storeInfo.findFirst();

    if (storeInfo) {
        const updated = await prisma.storeInfo.update({
            where: { id: storeInfo.id },
            data: {
                latitude: "24.6367746",
                longitude: "46.7726612",
                // Should I update the address? The link is to "Ar Rassi Artificial trees"
                // Let's stick to updating coordinates as requested by providing the link.
            }
        });
        console.log("Updated Store Info:", updated);
    } else {
        const created = await prisma.storeInfo.create({
            data: {
                name: "كراون أوتو",
                latitude: "24.6367746",
                longitude: "46.7726612",
            }
        });
        console.log("Created Store Info:", created);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
