import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';

export async function GET(request: NextRequest) {
    try {
        // Récupérer l'ID utilisateur depuis les paramètres de requête
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
        }

        // Chercher le portfolio existant
        let portfolio = await prisma.portfolio.findUnique({
            where: { userId },
            include: {
                pokemons: true
            }
        });

        // Si le portfolio n'existe pas, en créer un nouveau
        if (!portfolio) {
            portfolio = await prisma.portfolio.create({
                data: {
                    userId,
                    totalValue: 1000, // Valeur initiale
                    cashBalance: 1000, // Solde initial
                },
                include: {
                    pokemons: true
                }
            });
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Erreur lors de la récupération du portfolio:', error);
        return NextResponse.json({ error: 'Erreur serveur lors de la récupération du portfolio' }, { status: 500 });
    }
}

/**
 * PATCH /api/portfolio - Mettre à jour le portfolio
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, cashBalance, operation } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'ID utilisateur requis' },
                { status: 400 }
            );
        }

        if (!cashBalance || typeof cashBalance !== 'number') {
            return NextResponse.json(
                { error: 'Montant valide requis' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur a un portfolio
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        let updatedPortfolio;

        // Opération sur le solde
        if (operation === 'add') {
            updatedPortfolio = await prisma.portfolio.update({
                where: { userId },
                data: {
                    cashBalance: {
                        increment: cashBalance
                    }
                }
            });
        } else if (operation === 'subtract') {
            // Vérifier si le solde est suffisant
            if (portfolio.cashBalance < cashBalance) {
                return NextResponse.json(
                    { error: 'Solde insuffisant' },
                    { status: 400 }
                );
            }

            updatedPortfolio = await prisma.portfolio.update({
                where: { userId },
                data: {
                    cashBalance: {
                        decrement: cashBalance
                    }
                }
            });
        } else if (operation === 'set') {
            updatedPortfolio = await prisma.portfolio.update({
                where: { userId },
                data: {
                    cashBalance
                }
            });
        } else {
            return NextResponse.json(
                { error: 'Opération invalide. Utilisez "add", "subtract" ou "set"' },
                { status: 400 }
            );
        }

        return NextResponse.json(updatedPortfolio);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du portfolio:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la mise à jour du portfolio' },
            { status: 500 }
        );
    }
} 