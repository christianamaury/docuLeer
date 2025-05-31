import {PrismaClient} from '@prisma/client'

//It makes sure to have single cached instance of Prisma on our entire application

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient | undefined; // Allow it to be undefined initially
}

let prisma: PrismaClient;

// Unified logic for both production and development
if (!global.cachedPrisma) {
    console.log('Initializing new PrismaClient and caching globally.');
    global.cachedPrisma = new PrismaClient({
        // Optional: Add logging based on environment. For Vercel, Prisma recommends:
        // log: ['query', 'info', 'warn', 'error'], // Adjust as needed
    });
} else {
    console.log('Reusing cached PrismaClient from global.');
}
prisma = global.cachedPrisma;

export const db = prisma;