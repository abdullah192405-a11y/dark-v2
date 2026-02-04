
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const storeInfo = await prisma.storeInfo.findFirst();
    console.log('STORE_INFO_START');
    console.log(JSON.stringify(storeInfo));
    console.log('STORE_INFO_END');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
