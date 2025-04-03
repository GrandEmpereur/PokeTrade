import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';

// Cache de requêtes avec expiration (5 minutes)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes en ms
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
    try {
        // Récupérer l'ID de l'API depuis les paramètres de requête
        const apiId = request.nextUrl.searchParams.get('apiId');

        if (!apiId) {
            return NextResponse.json(
                { error: 'ID API Pokémon requis' },
                { status: 400 }
            );
        }

        // Vérifier si la requête est déjà en cache
        const cacheKey = `pokemon-${apiId}`;
        const cachedData = cache.get(cacheKey);

        // Si les données sont en cache et valides, les renvoyer directement
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
            return NextResponse.json(cachedData.data);
        }

        // Définir un timeout pour éviter les longues requêtes
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout de la requête')), 3000);
        });

        // Requête à la base de données avec timeout
        const dbPromise = new Promise(async (resolve) => {
            try {
                // Chercher le Pokémon par son ID d'API
                const pokemon = await prisma.pokemon.findFirst({
                    where: {
                        pokemonApiId: parseInt(apiId)
                    }
                });
                resolve(pokemon);
            } catch (error) {
                console.error('Erreur DB lors de la recherche du Pokémon:', error);
                resolve(null);
            }
        });

        // Exécuter la requête avec un timeout
        const pokemon = await Promise.race([dbPromise, timeoutPromise])
            .catch(error => {
                console.error('Erreur ou timeout lors de la recherche:', error);
                return null;
            });

        if (!pokemon) {
            return NextResponse.json(
                { error: 'Pokémon non trouvé dans la base de données' },
                { status: 404 }
            );
        }

        // Mettre en cache les résultats
        cache.set(cacheKey, {
            data: pokemon,
            timestamp: Date.now()
        });

        // Ajouter des headers de contrôle de cache
        const headers = new Headers();
        headers.set('Cache-Control', 'public, max-age=300');

        return NextResponse.json(pokemon, {
            headers,
            status: 200
        });
    } catch (error) {
        console.error('Erreur lors de la recherche du Pokémon:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la recherche du Pokémon' },
            { status: 500 }
        );
    }
} 