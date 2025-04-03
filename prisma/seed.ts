import { AlertCondition, OrderType, PrismaClient, TransactionType } from '@prisma/client'
import dotenv from 'dotenv'
import { join } from 'path'
import { existsSync } from 'fs'
import { createAdminClient } from '../src/utils/supabase/client'

// Charger les variables d'environnement .env
dotenv.config()

// Charger .env.local s'il existe
const envLocalPath = join(process.cwd(), '.env.local')
if (existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

// Initialiser Prisma
const prisma = new PrismaClient()

/**
 * Récupère les utilisateurs depuis Supabase via la clé Service Role
 */
async function getSupabaseUsers() {
    const supabaseAdmin = createAdminClient()
    try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()
        if (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error.message)
            return []
        }
        return data?.users || []
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err)
        return []
    }
}

/**
 * Seed des portfolios en se basant sur les utilisateurs Supabase.
 * Le modèle "User" n'étant pas défini dans Prisma, nous vérifions directement
 * l'existence d'un portfolio via le champ userId.
 */
async function seedUsersAndPortfolios() {
    console.log('Création des portfolios...')

    const supabaseUsers = await getSupabaseUsers()
    console.log(`${supabaseUsers.length} utilisateur(s) trouvé(s) dans Supabase.`)

    if (supabaseUsers.length === 0) {
        console.warn('Aucun utilisateur trouvé dans Supabase. Abandon du seeding des portfolios.')
        return
    }

    for (const supabaseUser of supabaseUsers) {
        const email = supabaseUser.email || ''

        try {
            // Vérifier si un portfolio existe déjà pour ce userId
            const existingPortfolio = await prisma.portfolio.findUnique({
                where: { userId: supabaseUser.id }
            })

            if (!existingPortfolio) {
                // Générer un solde aléatoire entre 1000 et 10000
                const initialBalance = Math.floor(Math.random() * 9000) + 1000

                await prisma.portfolio.create({
                    data: {
                        userId: supabaseUser.id,
                        totalValue: initialBalance,
                        cashBalance: initialBalance
                    }
                })

                console.log(`Portfolio créé pour: ${email}`)
            } else {
                console.log(`Portfolio existe déjà pour: ${email}`)
            }
        } catch (error) {
            console.error(`Erreur lors de la création du portfolio pour ${email}:`, error)
        }
    }

    console.log('Seeding des portfolios terminé.')
}

/**
 * Importe les Pokémon depuis l'API Pokémon et les ajoute à la base de données
 */
async function seedPokemons() {
    console.log('Vérification et importation des Pokémon depuis l\'API...')

    // Vérifier combien de Pokémon sont déjà dans la BDD
    const count = await prisma.pokemon.count()
    console.log(`${count} Pokémon déjà en base de données.`)

    // Si nous avons déjà beaucoup de Pokémon, nous pouvons sauter cette étape
    if (count > 200) {
        console.log('Base de données déjà bien fournie en Pokémon, importation ignorée.')
        return
    }

    try {
        // Nous allons importer les Pokémon par générations pour être efficaces
        // Générations disponibles (pour limiter l'importation)
        const generations = [
            { start: 1, end: 151 },     // Gen 1
            { start: 152, end: 251 },   // Gen 2
            { start: 252, end: 386 }    // Gen 3
            // Ajouter d'autres générations si nécessaire
        ]

        // Fonction pour déterminer la rareté
        function getRarity(id: number): string {
            if (id <= 151) return 'common'
            if (id <= 251) return 'uncommon'
            if (id <= 386) return 'rare'
            if (id <= 493) return 'very-rare'
            return 'legendary'
        }

        // Fonction helper pour calculer un prix basé sur l'ID et la rareté
        function calculatePrice(id: number): number {
            // Base price
            let price = 100

            // Plus l'ID est élevé, plus le Pokémon est rare
            if (id > 150) price += 50
            if (id > 250) price += 75
            if (id > 380) price += 100

            // Ajouter une variation aléatoire de +/- 10%
            const variation = Math.random() * 0.2 - 0.1 // Entre -10% et +10%
            price = price * (1 + variation)

            return Math.round(price * 100) / 100
        }

        // Importation par batch pour chaque génération
        for (const gen of generations) {
            console.log(`Importation des Pokémon de la génération ${generations.indexOf(gen) + 1}...`)

            // Préparer un batch de promesses pour les requêtes API
            const fetchPromises = []

            for (let id = gen.start; id <= gen.end; id++) {
                fetchPromises.push(
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(res => res.json())
                        .catch(err => {
                            console.error(`Erreur lors de la récupération du Pokémon #${id}:`, err)
                            return null
                        })
                )
            }

            // Attendre toutes les requêtes
            const pokemonData = await Promise.all(fetchPromises)

            // Filtrer les résultats null (en cas d'erreur)
            const validPokemonData = pokemonData.filter(p => p !== null)

            console.log(`${validPokemonData.length} Pokémon récupérés depuis l'API pour cette génération.`)

            // Préparer les données pour insertion
            const pokemonsToCreate = []

            for (const data of validPokemonData) {
                // Vérifier si le Pokémon existe déjà dans la BDD
                const existingPokemon = await prisma.pokemon.findFirst({
                    where: { pokemonApiId: data.id }
                })

                if (!existingPokemon) {
                    const price = calculatePrice(data.id)

                    pokemonsToCreate.push({
                        pokemonApiId: data.id,
                        name: data.name,
                        type: data.types.map((t: any) => t.type.name),
                        basePrice: price,
                        currentPrice: price,
                        image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
                        rarity: getRarity(data.id),
                        quantity: 10  // Quantité par défaut dans le marché
                    })
                }
            }

            // Insérer les Pokémon en batch
            if (pokemonsToCreate.length > 0) {
                console.log(`Insertion de ${pokemonsToCreate.length} nouveaux Pokémon en base de données...`)

                // Insérer par lots de 50 pour éviter les timeouts
                const chunkSize = 50
                for (let i = 0; i < pokemonsToCreate.length; i += chunkSize) {
                    const chunk = pokemonsToCreate.slice(i, i + chunkSize)
                    await prisma.pokemon.createMany({
                        data: chunk,
                        skipDuplicates: true  // Éviter les doublons
                    })
                }

                console.log('Insertion terminée avec succès.')
            } else {
                console.log('Aucun nouveau Pokémon à insérer.')
            }
        }

        console.log('Importation des Pokémon terminée.')
    } catch (error) {
        console.error('Erreur lors de l\'importation des Pokémon:', error)
    }
}

/**
 * Seed des alertes pour chaque portfolio.
 */
async function seedAlerts() {
    console.log('Création des alertes...')
    const portfolios = await prisma.portfolio.findMany()
    const pokemons = await prisma.pokemon.findMany()
    if (pokemons.length === 0) {
        console.warn('Aucun Pokémon trouvé pour créer des alertes. Abandon du seeding des alertes.')
        return
    }
    for (const portfolio of portfolios) {
        const numAlerts = Math.floor(Math.random() * 3) + 1 // 1 à 3 alertes par portfolio
        for (let i = 0; i < numAlerts; i++) {
            const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
            await prisma.alert.create({
                data: {
                    userId: portfolio.userId,
                    pokemonId: randomPokemon.id,
                    condition: ['ABOVE', 'BELOW', 'EQUAL'][Math.floor(Math.random() * 3)] as AlertCondition,
                    price: parseFloat((randomPokemon.currentPrice + (Math.random() * 20 - 10)).toFixed(2)),
                    triggered: false
                }
            })
        }
    }
    console.log('Alertes créées.')
}

/**
 * Seed des ordres (buy/sell) pour chaque portfolio.
 */
async function seedOrders() {
    console.log('Création des ordres...')
    const portfolios = await prisma.portfolio.findMany()
    const pokemons = await prisma.pokemon.findMany()
    if (pokemons.length === 0) {
        console.warn('Aucun Pokémon trouvé pour créer des ordres. Abandon du seeding des ordres.')
        return
    }
    for (const portfolio of portfolios) {
        const numOrders = Math.floor(Math.random() * 3) + 1 // 1 à 3 ordres par portfolio
        for (let i = 0; i < numOrders; i++) {
            const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
            const side = Math.random() < 0.5 ? 'BUY' : 'SELL'
            await prisma.order.create({
                data: {
                    userId: portfolio.userId,
                    type: ['MARKET', 'LIMIT', 'STOP'][Math.floor(Math.random() * 3)] as OrderType,
                    side: side,
                    quantity: Math.floor(Math.random() * 10) + 1,
                    price: parseFloat((randomPokemon.currentPrice + (Math.random() * 20 - 10)).toFixed(2)),
                    status: 'OPEN',
                    pokemonBuyId: side === 'BUY' ? randomPokemon.id : null,
                    pokemonSellId: side === 'SELL' ? randomPokemon.id : null
                }
            })
        }
    }
    console.log('Ordres créés.')
}

/**
 * Seed des transactions pour chaque portfolio.
 */
async function seedTransactions() {
    console.log('Création des transactions...')
    const portfolios = await prisma.portfolio.findMany()
    const orders = await prisma.order.findMany()
    const pokemons = await prisma.pokemon.findMany()
    if (pokemons.length === 0) {
        console.warn('Aucun Pokémon trouvé pour créer des transactions. Abandon du seeding des transactions.')
        return
    }
    for (const portfolio of portfolios) {
        const numTransactions = Math.floor(Math.random() * 3) + 1 // 1 à 3 transactions par portfolio
        for (let i = 0; i < numTransactions; i++) {
            const linkOrder = Math.random() < 0.5 && orders.length > 0
            const order = linkOrder ? orders[Math.floor(Math.random() * orders.length)] : null
            const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
            const typeOptions = ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL']
            const txType = typeOptions[Math.floor(Math.random() * typeOptions.length)]
            const quantity = Math.floor(Math.random() * 10) + 1
            const price = parseFloat((randomPokemon.currentPrice + (Math.random() * 20 - 10)).toFixed(2))
            const amount = parseFloat((quantity * price).toFixed(2))
            await prisma.transaction.create({
                data: {
                    userId: portfolio.userId,
                    type: txType as TransactionType,
                    pokemonId: (txType === 'BUY' || txType === 'SELL') ? randomPokemon.id : null,
                    orderId: order ? order.id : null,
                    quantity: (txType === 'BUY' || txType === 'SELL') ? quantity : null,
                    price: price,
                    amount: amount,
                    portfolioId: portfolio.id,
                    description: `${txType} transaction for portfolio ${portfolio.id}`
                }
            })
        }
    }
    console.log('Transactions créées.')
}

/**
 * Fonction principale d'exécution du seeding.
 */
async function main() {
    console.log('Démarrage du seeding...')

    try {
        await seedUsersAndPortfolios()
        await seedPokemons()
        await seedAlerts()
        await seedOrders()
        await seedTransactions()
        console.log('Seeding terminé avec succès!')
    } catch (error) {
        console.error('Erreur lors du seeding :', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .then(() => console.log('Seeding terminé.'))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
