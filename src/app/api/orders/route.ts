import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';
import { OrderSide, OrderStatus, OrderType } from '@prisma/client';

/**
 * GET /api/orders - Récupérer les ordres d'un utilisateur
 */
export async function GET(request: NextRequest) {
    try {
        // Récupérer l'ID utilisateur depuis les paramètres de requête
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'ID utilisateur requis' },
                { status: 400 }
            );
        }

        // Récupérer les ordres de l'utilisateur
        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                pokemonBuy: true,
                pokemonSell: true
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Erreur lors de la récupération des ordres:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la récupération des ordres' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orders - Créer un nouvel ordre (achat ou vente)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, pokemonId, quantity, price, orderType, side } = body;

        if (!userId || !pokemonId || !quantity || !price || !orderType || !side) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        const totalAmount = price * quantity;

        // Traitement différent selon qu'il s'agit d'un achat ou d'une vente
        if (side === OrderSide.BUY) {
            // === LOGIQUE D'ACHAT ===

            // Récupérer le portfolio de l'utilisateur
            const portfolio = await prisma.portfolio.findUnique({
                where: { userId }
            });

            if (!portfolio) {
                return NextResponse.json(
                    { error: "Portfolio non trouvé pour cet utilisateur" },
                    { status: 404 }
                );
            }

            // Vérifier une dernière fois que l'utilisateur a suffisamment d'argent
            const currentPortfolio = await prisma.portfolio.findUnique({
                where: { id: portfolio.id }
            });

            if (!currentPortfolio || currentPortfolio.cashBalance < totalAmount) {
                return NextResponse.json(
                    {
                        error: `Solde insuffisant. Vous avez ${currentPortfolio?.cashBalance.toFixed(2) || 0}, mais l'ordre nécessite ${totalAmount.toFixed(2)}`
                    },
                    { status: 400 }
                );
            }

            // Vérifier que le Pokémon existe
            let pokemon = await prisma.pokemon.findUnique({
                where: { id: pokemonId }
            });

            if (!pokemon) {
                return NextResponse.json(
                    { error: "Pokémon non trouvé" },
                    { status: 404 }
                );
            }

            // Créer l'ordre d'achat dans une transaction
            const result = await prisma.$transaction(async (tx) => {
                // 1. Si c'est un achat, réduire le solde de l'utilisateur
                await tx.portfolio.update({
                    where: { id: portfolio.id },
                    data: {
                        cashBalance: {
                            decrement: totalAmount
                        }
                    }
                });

                // 2. Créer l'ordre d'achat
                const order = await tx.order.create({
                    data: {
                        userId,
                        pokemonBuyId: pokemonId,
                        type: orderType as OrderType,
                        side: OrderSide.BUY,
                        quantity,
                        price,
                        status: OrderStatus.OPEN
                    }
                });

                // Pour un ordre de marché, exécuter immédiatement
                if (orderType === OrderType.MARKET) {
                    // Marquer l'ordre comme exécuté
                    const executedOrder = await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: OrderStatus.FILLED,
                            filledAt: new Date()
                        }
                    });

                    // Créer une transaction pour cet achat
                    const transaction = await tx.transaction.create({
                        data: {
                            userId,
                            type: 'BUY',
                            pokemonId,
                            orderId: order.id,
                            quantity,
                            price,
                            amount: totalAmount,
                            portfolioId: portfolio.id,
                            description: `Achat de ${quantity} ${pokemon.name} à ${price} chacun`
                        }
                    });

                    // Si le Pokémon existe déjà dans le portfolio, augmenter la quantité
                    // Sinon ajouter le Pokémon au portfolio
                    const existingPokemon = await tx.pokemon.findFirst({
                        where: {
                            pokemonApiId: pokemon.pokemonApiId,
                            portfolioId: portfolio.id
                        }
                    });

                    if (existingPokemon) {
                        await tx.pokemon.update({
                            where: { id: existingPokemon.id },
                            data: {
                                quantity: {
                                    increment: quantity
                                },
                                currentPrice: price // Mettre à jour le prix actuel
                            }
                        });
                    } else {
                        await tx.pokemon.create({
                            data: {
                                pokemonApiId: pokemon.pokemonApiId,
                                name: pokemon.name,
                                type: pokemon.type,
                                ownerId: userId,
                                portfolioId: portfolio.id,
                                basePrice: price,
                                currentPrice: price,
                                quantity,
                                image: pokemon.image,
                                rarity: pokemon.rarity
                            }
                        });
                    }

                    // Étape 2. Pour un achat, s'il s'agit d'un Pokémon du marché, créons-en une copie pour l'utilisateur
                    if (order.side === OrderSide.BUY && orderType === OrderType.MARKET) {
                        // Vérifier si c'est un Pokémon du marché (sans propriétaire)
                        if (!pokemon.ownerId) {
                            // C'est un Pokémon du marché, créons-en une copie dans le portfolio de l'utilisateur
                            const userPokemon = await tx.pokemon.create({
                                data: {
                                    pokemonApiId: pokemon.pokemonApiId,
                                    name: pokemon.name,
                                    type: pokemon.type,
                                    ownerId: userId,
                                    portfolioId: portfolio.id,
                                    basePrice: price,
                                    currentPrice: price,
                                    quantity,
                                    image: pokemon.image,
                                    rarity: pokemon.rarity
                                }
                            });

                            // Utiliser ce Pokémon pour la transaction - utilisons une nouvelle variable
                            const newPokemonId = userPokemon.id;

                            // Mettre à jour la transaction avec le nouveau pokemonId
                            await tx.transaction.update({
                                where: { id: transaction.id },
                                data: { pokemonId: newPokemonId }
                            });
                        }
                    }

                    return {
                        order: executedOrder,
                        transaction,
                        message: `Ordre d'achat exécuté avec succès pour ${quantity} ${pokemon.name}`
                    };
                }

                return {
                    order,
                    message: `Ordre d'achat créé avec succès et en attente d'exécution`
                };
            });

            return NextResponse.json({
                success: true,
                orderId: result.order.id,
                message: result.message
            });

        } else if (side === OrderSide.SELL) {
            // === LOGIQUE DE VENTE ===

            // Récupérer le portfolio de l'utilisateur
            const portfolio = await prisma.portfolio.findUnique({
                where: { userId }
            });

            if (!portfolio) {
                return NextResponse.json(
                    { error: "Portfolio non trouvé pour cet utilisateur" },
                    { status: 404 }
                );
            }

            // Vérifier que le Pokémon appartient bien à l'utilisateur et existe dans son portfolio
            let pokemon = await prisma.pokemon.findFirst({
                where: {
                    id: pokemonId,
                    portfolioId: portfolio.id
                }
            });

            if (!pokemon) {
                return NextResponse.json(
                    { error: "Ce Pokémon n'existe pas dans votre portfolio ou ne vous appartient pas" },
                    { status: 404 }
                );
            }

            if (pokemon.quantity < quantity) {
                return NextResponse.json(
                    { error: `Quantité insuffisante. Vous avez ${pokemon.quantity} ${pokemon.name}, mais vous essayez d'en vendre ${quantity}` },
                    { status: 400 }
                );
            }

            // Créer l'ordre de vente dans une transaction
            const result = await prisma.$transaction(async (tx) => {
                // 1. Créer l'ordre de vente
                const order = await tx.order.create({
                    data: {
                        userId,
                        pokemonSellId: pokemonId,
                        type: orderType as OrderType,
                        side: OrderSide.SELL,
                        quantity,
                        price,
                        status: OrderStatus.OPEN
                    }
                });

                // Pour un ordre de marché, exécuter immédiatement
                if (orderType === OrderType.MARKET) {
                    // Marquer l'ordre comme exécuté
                    const executedOrder = await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: OrderStatus.FILLED,
                            filledAt: new Date()
                        }
                    });

                    // Créer une transaction pour cette vente
                    const transaction = await tx.transaction.create({
                        data: {
                            userId,
                            type: 'SELL',
                            pokemonId,
                            orderId: order.id,
                            quantity,
                            price,
                            amount: totalAmount,
                            portfolioId: portfolio.id,
                            description: `Vente de ${quantity} ${pokemon.name} à ${price} chacun`
                        }
                    });

                    // Augmenter le solde du portfolio pour une vente
                    if (order.side === OrderSide.SELL) {
                        await tx.portfolio.update({
                            where: { id: portfolio.id },
                            data: {
                                cashBalance: {
                                    increment: totalAmount
                                }
                            }
                        });
                    }

                    // Mettre à jour la quantité du Pokémon
                    if (pokemon.quantity === quantity) {
                        // Si l'utilisateur vend tous ses Pokémon, supprimer l'entrée
                        await tx.pokemon.delete({
                            where: { id: pokemon.id }
                        });
                    } else {
                        // Sinon, réduire la quantité
                        await tx.pokemon.update({
                            where: { id: pokemon.id },
                            data: {
                                quantity: {
                                    decrement: quantity
                                },
                                currentPrice: price // Mettre à jour le prix actuel
                            }
                        });
                    }

                    return {
                        order: executedOrder,
                        transaction,
                        message: `Ordre de vente exécuté avec succès pour ${quantity} ${pokemon.name}`
                    };
                }

                return {
                    order,
                    message: `Ordre de vente créé avec succès et en attente d'exécution`
                };
            });

            return NextResponse.json({
                success: true,
                orderId: result.order.id,
                message: result.message
            });
        } else {
            return NextResponse.json(
                { error: "Type d'ordre invalide (doit être BUY ou SELL)" },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error("Erreur lors de la création de l'ordre:", error);
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue lors de la création de l'ordre" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/orders/:id - Annuler un ordre
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, userId, action } = body;

        if (!orderId || !userId || !action) {
            return NextResponse.json(
                { error: 'ID ordre, ID utilisateur et action requis' },
                { status: 400 }
            );
        }

        // Vérifier que l'action est valide (pour l'instant seulement "cancel")
        if (action !== 'cancel') {
            return NextResponse.json(
                { error: 'Action non supportée. Seule "cancel" est disponible.' },
                { status: 400 }
            );
        }

        // Récupérer l'ordre pour vérification
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Ordre non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier que l'ordre appartient à l'utilisateur
        if (order.userId !== userId) {
            return NextResponse.json(
                { error: "Vous n'êtes pas autorisé à annuler cet ordre" },
                { status: 403 }
            );
        }

        // Vérifier que l'ordre est encore en attente
        if (order.status !== OrderStatus.OPEN) {
            return NextResponse.json(
                { error: `Impossible d'annuler un ordre avec le statut ${order.status}` },
                { status: 400 }
            );
        }

        // Annuler l'ordre dans une transaction
        await prisma.$transaction(async (tx) => {
            // Mettre à jour le statut de l'ordre
            await tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED }
            });

            // Si c'était un ordre d'achat, rembourser le solde réservé
            if (order.side === OrderSide.BUY) {
                const refundAmount = order.price * order.quantity;

                // Récupérer le portfolio de l'utilisateur
                const portfolio = await tx.portfolio.findUnique({
                    where: { userId }
                });

                if (portfolio) {
                    await tx.portfolio.update({
                        where: { id: portfolio.id },
                        data: {
                            cashBalance: {
                                increment: refundAmount
                            }
                        }
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Ordre annulé avec succès"
        });

    } catch (error: any) {
        console.error("Erreur lors de l'annulation de l'ordre:", error);
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue lors de l'annulation de l'ordre" },
            { status: 500 }
        );
    }
} 