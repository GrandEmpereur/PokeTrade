import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
    try {
        // Récupérer quelques échantillons de données de chaque modèle
        const users = await prisma.user.findMany({
            take: 5,
            include: {
                _count: {
                    select: {
                        posts: true,
                        cards: true,
                        collections: true,
                        sentTrades: true,
                        receivedTrades: true,
                    },
                },
            },
        });

        const posts = await prisma.post.findMany({
            take: 5,
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const products = await prisma.product.findMany({
            take: 5,
        });

        const cards = await prisma.card.findMany({
            take: 5,
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const collections = await prisma.collection.findMany({
            take: 5,
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        cards: true,
                    },
                },
            },
        });

        const trades = await prisma.trade.findMany({
            take: 5,
            include: {
                initiator: {
                    select: {
                        name: true,
                    },
                },
                receiver: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        items: true,
                    },
                },
            },
        });

        // Renvoyer toutes les données
        return NextResponse.json({
            success: true,
            dbStatus: "Connected",
            data: {
                users,
                posts,
                products,
                cards,
                collections,
                trades,
                models: {
                    User: await prisma.user.count(),
                    Post: await prisma.post.count(),
                    Product: await prisma.product.count(),
                    Card: await prisma.card.count(),
                    Collection: await prisma.collection.count(),
                    Trade: await prisma.trade.count(),
                    TradeItem: await prisma.tradeItem.count(),
                    Wishlist: await prisma.wishlist.count(),
                    WishlistItem: await prisma.wishlistItem.count(),
                }
            },
        });
    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to connect to database',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
} 