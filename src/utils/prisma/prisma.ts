import { PrismaClient } from '@prisma/client';

// Variable globale pour stocker l'instance PrismaClient
declare global {
    var prisma: PrismaClient | undefined;
}

// Exporter une instance PrismaClient partagée pour éviter les connexions multiples
export const prisma =
    global.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

// Éviter les connexions multiples en développement hot-reload
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
} 