import { PokemonDetails } from '@/types/pokemon/pokemon.types';
import { tradeService, TradeResponse } from './trade.service';

/**
 * Action serveur pour acheter un Pokémon
 */
export async function purchasePokemon(
    pokemonDetails: PokemonDetails,
    price: number,
    quantity: number = 1
): Promise<TradeResponse<any>> {
    try {
        const result = await tradeService.purchasePokemon(pokemonDetails, price, quantity);
        return result;
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Erreur lors de l'achat du Pokémon"
        };
    }
}

/**
 * Action serveur pour vérifier les fonds disponibles
 */
export async function checkSufficientFunds(
    price: number,
    quantity: number = 1
): Promise<TradeResponse<boolean>> {
    try {
        const result = await tradeService.checkSufficientFunds(price, quantity);
        return result;
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Erreur lors de la vérification des fonds"
        };
    }
}

/**
 * Action serveur pour récupérer le portefeuille de l'utilisateur
 */
export async function getUserPortfolio(): Promise<TradeResponse<any>> {
    try {
        const result = await tradeService.getUserPortfolio();
        return result;
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Erreur lors de la récupération du portefeuille"
        };
    }
} 