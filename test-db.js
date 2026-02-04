require('dotenv').config();
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
    try {
        const pixels = await prisma.pixelSettings.findFirst();
        console.log("Success: Table exists and found:", pixels ? "with data" : "empty");
        process.exit(0);
    } catch (err) {
        console.error("Error: ", err.message);
        process.exit(1);
    }
}

main();
