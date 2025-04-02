import { createClient } from '@/utils/supabase/client';
import { PokemonDetails } from '@/types/pokemon/pokemon.types';

/**
 * Interface pour la représentation du portefeuille utilisateur
 */
export interface UserPortfolio {
    cashBalance: number;
    ownedPokemons: {
        pokemon: PokemonDetails;
        quantity: number;
        avgBuyPrice: number;
    }[];
}

/**
 * Type de réponse générique pour les services de trading
 */
export interface TradeResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PurchaseData {
    pokemonApiId: number;
    price: number;
    quantity: number;
}

export class TradeService {
    private supabase = createClient();

    /**
     * Récupère le portfolio de l'utilisateur actuel ou en crée un s'il n'existe pas
     */
    async getUserPortfolio(): Promise<TradeResponse<UserPortfolio>> {
        try {
            // Récupérer l'ID de l'utilisateur
            const { data: userData, error: userError } = await this.supabase.auth.getUser();
            if (userError || !userData.user) {
                return { success: false, error: 'Utilisateur non authentifié' };
            }

            const userId = userData.user.id;

            // Chercher le portfolio existant
            const { data: portfolio, error: portfolioError } = await this.supabase
                .from('Portfolio')
                .select('*')
                .eq('userId', userId)
                .single();

            if (portfolioError && portfolioError.code !== 'PGRST116') {
                // Erreur autre que "pas de résultat"
                return { success: false, error: portfolioError.message };
            }

            if (portfolio) {
                return { success: true, data: portfolio };
            }

            // Créer un nouveau portfolio si aucun n'existe
            const { data: newPortfolio, error: createError } = await this.supabase
                .from('Portfolio')
                .insert([{ userId, cashBalance: 1000 }])
                .select()
                .single();

            if (createError) {
                return { success: false, error: createError.message };
            }

            return { success: true, data: newPortfolio };
        } catch (error: any) {
            return { success: false, error: error.message || 'Erreur lors de la récupération du portfolio' };
        }
    }

    /**
     * Vérifie si l'utilisateur a assez de fonds pour acheter
     */
    async checkSufficientFunds(price: number, quantity: number): Promise<TradeResponse<boolean>> {
        try {
            const portfolioResponse = await this.getUserPortfolio();
            if (!portfolioResponse.success) {
                return portfolioResponse;
            }

            const portfolio = portfolioResponse.data;
            const totalCost = price * quantity;

            return {
                success: true,
                data: portfolio.cashBalance >= totalCost
            };
        } catch (error: any) {
            return { success: false, error: error.message || 'Erreur lors de la vérification des fonds' };
        }
    }

    /**
     * Achète un Pokémon et l'ajoute au portefeuille
     */
    async purchasePokemon(
        pokemonDetails: PokemonDetails,
        price: number,
        quantity: number = 1
    ): Promise<TradeResponse<{ portfolio: UserPortfolio }>> {
        try {
            // Vérifier l'authentification
            const { data: userData, error: userError } = await this.supabase.auth.getUser();
            if (userError || !userData.user) {
                return { success: false, error: 'Utilisateur non authentifié' };
            }

            const userId = userData.user.id;

            // Vérifier les fonds disponibles
            const fundsCheck = await this.checkSufficientFunds(price, quantity);
            if (!fundsCheck.success || !fundsCheck.data) {
                return {
                    success: false,
                    error: fundsCheck.error || 'Fonds insuffisants pour cette transaction'
                };
            }

            // Récupérer le portfolio
            const portfolioResponse = await this.getUserPortfolio();
            if (!portfolioResponse.success) {
                return portfolioResponse;
            }

            const portfolio = portfolioResponse.data;
            const totalCost = price * quantity;

            // Commencer une transaction avec Supabase
            // Note: Supabase Edge Functions seraient préférables pour garantir l'atomicité

            // 1. Créer ou mettre à jour le Pokémon
            const { data: existingPokemon, error: checkError } = await this.supabase
                .from('Pokemon')
                .select('*')
                .eq('pokemonApiId', pokemonDetails.id)
                .eq('portfolioId', portfolio.id)
                .single();

            let pokemonId;

            if (checkError && checkError.code !== 'PGRST116') {
                return { success: false, error: checkError.message };
            }

            if (existingPokemon) {
                // Mettre à jour un Pokémon existant
                const { data: updatedPokemon, error: updateError } = await this.supabase
                    .from('Pokemon')
                    .update({
                        quantity: existingPokemon.quantity + quantity,
                        currentPrice: price,
                        updatedAt: new Date().toISOString()
                    })
                    .eq('id', existingPokemon.id)
                    .select()
                    .single();

                if (updateError) {
                    return { success: false, error: updateError.message };
                }

                pokemonId = existingPokemon.id;
            } else {
                // Créer un nouveau Pokémon
                const { data: newPokemon, error: insertError } = await this.supabase
                    .from('Pokemon')
                    .insert([{
                        pokemonApiId: pokemonDetails.id,
                        name: pokemonDetails.name,
                        type: pokemonDetails.types.map(t => t.type.name),
                        ownerId: userId,
                        portfolioId: portfolio.id,
                        basePrice: price,
                        currentPrice: price,
                        image: pokemonDetails.sprites.other?.['official-artwork']?.front_default ||
                            pokemonDetails.sprites.front_default,
                        quantity: quantity
                    }])
                    .select()
                    .single();

                if (insertError) {
                    return { success: false, error: insertError.message };
                }

                pokemonId = newPokemon.id;
            }

            // 2. Créer un ordre (MARKET, à titre de référence)
            const { data: order, error: orderError } = await this.supabase
                .from('Order')
                .insert([{
                    userId,
                    pokemonId,
                    type: 'MARKET',
                    side: 'BUY',
                    quantity,
                    price,
                    status: 'FILLED',
                    filledAt: new Date().toISOString()
                }])
                .select()
                .single();

            if (orderError) {
                return { success: false, error: orderError.message };
            }

            // 3. Enregistrer la transaction
            const { data: transaction, error: transactionError } = await this.supabase
                .from('Transaction')
                .insert([{
                    userId,
                    type: 'BUY',
                    pokemonId,
                    orderId: order.id,
                    quantity,
                    price,
                    amount: totalCost,
                    portfolioId: portfolio.id
                }])
                .select()
                .single();

            if (transactionError) {
                return { success: false, error: transactionError.message };
            }

            // 4. Mettre à jour le solde du portfolio
            const { data: updatedPortfolio, error: portfolioUpdateError } = await this.supabase
                .from('Portfolio')
                .update({
                    cashBalance: portfolio.cashBalance - totalCost,
                    totalValue: portfolio.totalValue + totalCost,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', portfolio.id)
                .select()
                .single();

            if (portfolioUpdateError) {
                return { success: false, error: portfolioUpdateError.message };
            }

            return {
                success: true,
                data: {
                    transaction,
                    order,
                    portfolio: updatedPortfolio
                }
            };

        } catch (error: any) {
            return { success: false, error: error.message || "Erreur lors de l'achat du Pokémon" };
        }
    }
}

// Exporter une instance singleton du service
export const tradeService = new TradeService(); 