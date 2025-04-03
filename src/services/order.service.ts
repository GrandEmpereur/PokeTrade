import { OrderType, OrderSide, OrderStatus } from '@prisma/client';

/**
 * Paramètres pour la création d'un ordre d'achat
 */
interface BuyOrderParams {
    pokemonId: string;
    quantity: number;
    price: number;
    orderType: OrderType;
}

/**
 * Paramètres pour la création d'un ordre de vente
 */
interface SellOrderParams {
    pokemonId: string;
    quantity: number;
    price: number;
    orderType: OrderType;
}

/**
 * Type de retour pour une opération sur un ordre
 */
export type OrderResult = {
    success: boolean;
    orderId?: string;
    error?: string;
    message?: string;
};

/**
 * Service de gestion des ordres d'achat et de vente via des appels API
 */
export class OrderService {
    /**
     * Crée un ordre d'achat pour un Pokémon.
     * Pour un ordre de marché, l'exécution se fait immédiatement.
     */
    async buyOrder(userId: string, params: BuyOrderParams): Promise<OrderResult> {
        try {
            const { pokemonId, quantity, price, orderType } = params;

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    pokemonId,
                    quantity,
                    price,
                    orderType,
                    side: OrderSide.BUY
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Erreur lors de la création de l\'ordre d\'achat'
                };
            }

            return {
                success: true,
                orderId: data.orderId,
                message: data.message
            };
        } catch (error: any) {
            console.error("Erreur lors de la création de l'ordre d'achat:", error);
            return {
                success: false,
                error: error.message || "Erreur lors de la création de l'ordre d'achat"
            };
        }
    }

    /**
     * Crée un ordre de vente pour un Pokémon.
     * Pour un ordre de marché, l'exécution se fait immédiatement.
     */
    async sellOrder(userId: string, params: SellOrderParams): Promise<OrderResult> {
        try {
            const { pokemonId, quantity, price, orderType } = params;

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    pokemonId,
                    quantity,
                    price,
                    orderType,
                    side: OrderSide.SELL
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Erreur lors de la création de l\'ordre de vente'
                };
            }

            return {
                success: true,
                orderId: data.orderId,
                message: data.message
            };
        } catch (error: any) {
            console.error("Erreur lors de la création de l'ordre de vente:", error);
            return {
                success: false,
                error: error.message || "Erreur lors de la création de l'ordre de vente"
            };
        }
    }

    /**
     * Récupère les ordres d'un utilisateur.
     */
    async getUserOrders(userId: string) {
        try {
            const response = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Erreur lors de la récupération des ordres'
                };
            }

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Erreur lors de la récupération des ordres"
            };
        }
    }

    /**
     * Annule un ordre ouvert.
     * Pour un ordre d'achat, le montant est remboursé dans le Portfolio.
     */
    async cancelOrder(orderId: string, userId: string): Promise<OrderResult> {
        try {
            const response = await fetch(`/api/orders`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    userId,
                    action: 'cancel'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Erreur lors de l\'annulation de l\'ordre'
                };
            }

            return {
                success: true,
                message: data.message || "Ordre annulé avec succès"
            };
        } catch (error: any) {
            console.error("Erreur lors de l'annulation de l'ordre:", error);
            return {
                success: false,
                error: error.message || "Erreur lors de l'annulation de l'ordre"
            };
        }
    }
}

export const orderService = new OrderService();
