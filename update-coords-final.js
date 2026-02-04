
require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    console.log("UPDATE_PROCESS_START");
    const storeInfo = await prisma.storeInfo.findFirst();

    if (storeInfo) {
        const updated = await prisma.storeInfo.update({
            where: { id: storeInfo.id },
            data: {
                latitude: "24.6367746",
                longitude: "46.7726612",
            }
        });
        console.log("UPDATED_SUCCESSFULLY:", updated.id);
    } else {
        const created = await prisma.storeInfo.create({
            data: {
                name: "كراون أوتو",
                latitude: "24.6367746",
                longitude: "46.7726612",
            }
        });
        console.log("CREATED_SUCCESSFULLY:", created.id);
    }
}

main()
    .catch(e => {
        console.error("ERROR_OCCURRED:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("DISCONNECTED");
    });
