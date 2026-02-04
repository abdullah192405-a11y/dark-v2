
const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    console.log("FETCHING_START");
    const storeInfo = await prisma.storeInfo.findFirst();
    console.log(JSON.stringify(storeInfo, null, 2));
    console.log("FETCHING_END");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
