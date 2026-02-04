
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const storeInfo = await prisma.storeInfo.findFirst();
    console.log(JSON.stringify(storeInfo, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
