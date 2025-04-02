import { PrismaClient, TradeStatus, AlertCondition, OrderType, OrderSide, OrderStatus, Pokemon, User, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Nombre d'éléments à générer
const NUM_USERS = 10;
const NUM_POKEMONS_PER_USER = 15;
const NUM_TRADES = 20;
const NUM_POSTS = 30;
const NUM_COMMENTS = 100;
const NUM_CHARTS = 25;
const NUM_PRICE_HISTORIES = 500;
const NUM_ORDERS = 40;
const NUM_ALERTS = 20;
const NUM_FOLLOWS = 30;

// Interfaces pour les types étendus
interface UserWithPortfolio extends User {
    portfolio?: {
        id: string;
    } | null;
}

// Utilisateurs prédéfinis (simulant des utilisateurs Supabase existants)
const predefinedUsers = [
    {
        username: 'admin',
        email: 'admin@poketrade.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        bio: 'Administrateur de la plateforme PokéTrade',
        isVerified: true,
        reputation: 100
    },
    {
        username: 'ash_ketchum',
        email: 'ash@pokemon.com',
        password: 'pikachu123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ash',
        bio: 'Dresseur Pokémon professionnel, cherche à devenir le meilleur!',
        isVerified: true,
        reputation: 85
    },
    {
        username: 'misty',
        email: 'misty@cerulean.gym',
        password: 'watertype123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=misty',
        bio: 'Championne d\'arène spécialisée dans les Pokémon eau',
        isVerified: true,
        reputation: 75
    }
];

// Fonction utilitaire pour générer un tableau d'éléments
function generateMany<T>(num: number, generator: () => Promise<T>): Promise<T[]> {
    return Promise.all(Array.from({ length: num }, () => generator()));
}

// Fonction utilitaire pour choisir un élément aléatoire dans un tableau
function pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Fonction utilitaire pour choisir plusieurs éléments aléatoires dans un tableau
function pickRandomMany<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

// Listes de données pour la génération
const pokemonTypes = [
    'Feu', 'Eau', 'Plante', 'Électrique', 'Normal', 'Combat', 'Vol', 'Poison',
    'Sol', 'Roche', 'Insecte', 'Spectre', 'Acier', 'Psy', 'Glace', 'Dragon', 'Ténèbres', 'Fée'
];

const pokemonNames = [
    'Pikachu', 'Dracaufeu', 'Mewtwo', 'Évoli', 'Rondoudou', 'Leveinard',
    'Mew', 'Roucool', 'Miaouss', 'Lokhlass', 'Métamorph', 'Noctali',
    'Aquali', 'Voltali', 'Pyroli', 'Bulbizarre', 'Salamèche', 'Carapuce',
    'Papilusion', 'Goupix', 'Nidoran', 'Mewtwo', 'Artikodin', 'Électhor',
    'Sulfura', 'Psykokwak', 'Tygnon', 'Staross', 'Insécateur', 'Tortank',
    'Ronflex', 'Minidraco', 'Dracolosse', 'Rhinoféros', 'Persian'
];

const rarities = [
    'Common', 'Uncommon', 'Rare', 'Very Rare', 'Ultra Rare', 'Legendary', 'Mythical'
];

const pokemonAbilities = [
    'Static', 'Lightning Rod', 'Overgrow', 'Blaze', 'Torrent', 'Chlorophyll',
    'Solar Power', 'Rain Dish', 'Shield Dust', 'Shed Skin', 'Compound Eyes',
    'Swarm', 'Keen Eye', 'Run Away', 'Intimidate', 'Rivalry', 'Limber',
    'Technician', 'Synchronize', 'Inner Focus', 'Sturdy', 'Rock Head',
    'Flash Fire', 'Adaptability', 'Clear Body', 'Liquid Ooze', 'Sand Stream'
];

async function main() {
    console.log('🌱 Début du seeding...');

    // Nettoyer la base de données
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.chart.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.order.deleteMany();
    await prisma.pokemonAttributes.deleteMany();
    await prisma.marketStatistics.deleteMany();
    await prisma.tradePokemon.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.pokemon.deleteMany();
    await prisma.portfolio.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.user.deleteMany();

    // Créer les utilisateurs
    console.log('👤 Création des utilisateurs...');

    // 1. Création des utilisateurs prédéfinis (Supabase)
    const createdUsers: UserWithPortfolio[] = [];
    for (const userData of predefinedUsers) {
        // Créer l'utilisateur avec son portfolio
        const user = await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                avatar: userData.avatar,
                bio: userData.bio,
                reputation: userData.reputation,
                isVerified: userData.isVerified,
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                portfolio: {
                    create: {
                        totalValue: 0,
                        updatedAt: new Date()
                    }
                },
                wishlist: {
                    create: {
                        createdAt: faker.date.past()
                    }
                }
            },
            include: {
                portfolio: true
            }
        });

        createdUsers.push(user as UserWithPortfolio);
    }

    // 2. Création d'utilisateurs aléatoires
    const randomUsers = await generateMany<UserWithPortfolio>(NUM_USERS, async () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const user = await prisma.user.create({
            data: {
                username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
                email: faker.internet.email({ firstName, lastName }).toLowerCase(),
                password: faker.internet.password(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
                bio: faker.lorem.sentences(2),
                reputation: faker.number.int({ min: 0, max: 100 }),
                isVerified: faker.datatype.boolean(0.3), // 30% chance d'être vérifié
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                portfolio: {
                    create: {
                        totalValue: 0,
                        updatedAt: new Date()
                    }
                },
                wishlist: {
                    create: {
                        createdAt: faker.date.past()
                    }
                }
            },
            include: {
                portfolio: true
            }
        });

        return user as UserWithPortfolio;
    });

    const allUsers: UserWithPortfolio[] = [...createdUsers, ...randomUsers];
    console.log(`✅ Créé ${allUsers.length} utilisateurs`);

    // Créer les relations de suivis (follows)
    console.log('👥 Création des relations de suivis...');
    const follows = await generateMany(NUM_FOLLOWS, async () => {
        const [follower, following] = pickRandomMany(allUsers, 2);
        if (follower.id === following.id) {
            // Éviter de se suivre soi-même
            const otherUsers = allUsers.filter(u => u.id !== follower.id);
            if (otherUsers.length > 0) {
                const newFollowing = pickRandom(otherUsers);
                return prisma.follow.create({
                    data: {
                        followerId: follower.id,
                        followingId: newFollowing.id,
                        createdAt: faker.date.past()
                    }
                });
            }
            // Si pas d'autres utilisateurs, ignorer cette relation
            return null;
        }

        return prisma.follow.create({
            data: {
                followerId: follower.id,
                followingId: following.id,
                createdAt: faker.date.past()
            }
        }).catch(() => null); // Ignorer les erreurs d'unicité
    });

    const validFollows = follows.filter(Boolean);
    console.log(`✅ Créé ${validFollows.length} relations de suivis`);

    // Créer les pokemons et leurs attributs
    console.log('🃏 Création des pokemons...');
    const pokemons: Pokemon[] = [];

    for (const user of allUsers) {
        const userPokemons = await generateMany<Pokemon>(NUM_POKEMONS_PER_USER, async () => {
            const name = pickRandom(pokemonNames);
            const type = pickRandom(pokemonTypes);
            const rarity = pickRandom(rarities);
            const generation = faker.number.int({ min: 1, max: 9 });
            const price = parseFloat(faker.commerce.price({ min: 5, max: 1000 }));
            const marketCap = price * faker.number.int({ min: 100, max: 10000 });

            // Créer le pokémon
            const pokemon = await prisma.pokemon.create({
                data: {
                    name,
                    type,
                    level: faker.number.int({ min: 1, max: 100 }),
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${faker.number.int({ min: 1, max: 898 })}.png`,
                    description: faker.lorem.paragraph(),
                    rarity,
                    price,
                    marketCap,
                    ownerId: user.id,
                    portfolioId: user.portfolio?.id,
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent()
                }
            });

            // Créer les attributs du pokémon
            await prisma.pokemonAttributes.create({
                data: {
                    pokemonId: pokemon.id,
                    rarity,
                    generation,
                    abilities: Array.from(
                        { length: faker.number.int({ min: 1, max: 3 }) },
                        () => pickRandom(pokemonAbilities)
                    ),
                    stats: {
                        hp: faker.number.int({ min: 20, max: 150 }),
                        attack: faker.number.int({ min: 20, max: 150 }),
                        defense: faker.number.int({ min: 20, max: 150 }),
                        specialAttack: faker.number.int({ min: 20, max: 150 }),
                        specialDefense: faker.number.int({ min: 20, max: 150 }),
                        speed: faker.number.int({ min: 20, max: 150 })
                    }
                }
            });

            return pokemon;
        });

        pokemons.push(...userPokemons);
    }

    console.log(`✅ Créé ${pokemons.length} pokémons avec attributs`);

    // Créer l'historique des prix
    console.log("📈 Création de l'historique des prix...");
    const histories = await generateMany(NUM_PRICE_HISTORIES, async () => {
        const pokemon = pickRandom(pokemons);
        const basePrice = pokemon.price;
        const timestamp = faker.date.past({ years: 1 });

        // Variation de prix autour du prix actuel
        const variationPercent = faker.number.float({ min: -15, max: 15 }) / 100;
        const price = Math.max(basePrice * (1 + variationPercent), 1);

        return prisma.priceHistory.create({
            data: {
                pokemonId: pokemon.id,
                price,
                volume: faker.number.int({ min: 1, max: 1000 }),
                timestamp
            }
        });
    });

    console.log(`✅ Créé ${histories.length} points d'historique de prix`);

    // Créer les posts et commentaires
    console.log('📝 Création des posts et commentaires...');
    const posts = await generateMany(NUM_POSTS, async () => {
        const user = pickRandom(allUsers);
        const hasPokemonTag = faker.datatype.boolean(0.7); // 70% chance d'avoir un Pokémon associé
        const pokemon = hasPokemonTag ? pickRandom(pokemons) : null;

        const post = await prisma.post.create({
            data: {
                userId: user.id,
                title: faker.lorem.sentence({ min: 3, max: 8 }),
                content: faker.lorem.paragraphs(3),
                pokemonId: pokemon?.id,
                likes: faker.number.int({ min: 0, max: 50 }),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent()
            }
        });

        // Générer des commentaires pour ce post
        const commentCount = faker.number.int({ min: 0, max: 8 });
        const postComments = await generateMany(commentCount, async () => {
            const commentUser = pickRandom(allUsers);

            return prisma.comment.create({
                data: {
                    postId: post.id,
                    userId: commentUser.id,
                    content: faker.lorem.paragraph(),
                    createdAt: faker.date.between({ from: post.createdAt, to: new Date() })
                }
            });
        });

        return { post, commentCount };
    });

    console.log(`✅ Créé ${posts.length} posts avec leurs commentaires`);

    // Créer les graphiques personnalisés
    console.log('📊 Création des graphiques personnalisés...');
    const charts = await generateMany(NUM_CHARTS, async () => {
        const user = pickRandom(allUsers);
        const pokemon = pickRandom(pokemons);

        return prisma.chart.create({
            data: {
                userId: user.id,
                pokemonId: pokemon.id,
                layout: {
                    title: `Analyse ${pokemon.name}`,
                    candlestick: true,
                    timeframe: pickRandom(['1h', '4h', '1d', '1w']),
                    theme: pickRandom(['light', 'dark']),
                    showVolume: faker.datatype.boolean()
                },
                indicators: {
                    showMA: faker.datatype.boolean(),
                    maLength: [20, 50, 200][faker.number.int({ min: 0, max: 2 })],
                    showRSI: faker.datatype.boolean(),
                    showBollingerBands: faker.datatype.boolean(),
                    customIndicators: []
                },
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent()
            }
        });
    });

    console.log(`✅ Créé ${charts.length} graphiques personnalisés`);

    // Créer les alertes
    console.log('🔔 Création des alertes...');
    const alerts = await generateMany(NUM_ALERTS, async () => {
        const user = pickRandom(allUsers);
        const pokemon = pickRandom(pokemons);
        const currentPrice = pokemon.price;

        // Définir une condition avec un prix cible
        const condition = pickRandom([AlertCondition.ABOVE, AlertCondition.BELOW, AlertCondition.EQUAL]);
        let targetPrice;

        if (condition === AlertCondition.ABOVE) {
            // Prix cible au-dessus du prix actuel
            targetPrice = currentPrice * (1 + faker.number.float({ min: 0.05, max: 0.3 }));
        } else if (condition === AlertCondition.BELOW) {
            // Prix cible en-dessous du prix actuel
            targetPrice = currentPrice * (1 - faker.number.float({ min: 0.05, max: 0.3 }));
        } else {
            // Prix cible exact (arrondi)
            targetPrice = Math.round(currentPrice * 100) / 100;
        }

        return prisma.alert.create({
            data: {
                userId: user.id,
                pokemonId: pokemon.id,
                condition,
                price: targetPrice,
                triggered: faker.datatype.boolean(0.2), // 20% chance d'être déjà déclenché
                createdAt: faker.date.past()
            }
        });
    });

    console.log(`✅ Créé ${alerts.length} alertes de prix`);

    // Créer les ordres
    console.log("📑 Création des ordres d'achat et de vente...");
    const orders = await generateMany(NUM_ORDERS, async () => {
        const user = pickRandom(allUsers);
        const pokemon = pickRandom(pokemons);
        const currentPrice = pokemon.price;

        // Déterminer le type d'ordre et le côté (achat/vente)
        const type = pickRandom([OrderType.MARKET, OrderType.LIMIT, OrderType.STOP]);
        const side = pickRandom([OrderSide.BUY, OrderSide.SELL]);

        // Définir le prix en fonction du type d'ordre
        let orderPrice;
        if (type === OrderType.MARKET) {
            // Prix du marché (actuel)
            orderPrice = currentPrice;
        } else if (type === OrderType.LIMIT) {
            // Prix limite (meilleur que le marché)
            if (side === OrderSide.BUY) {
                orderPrice = currentPrice * (1 - faker.number.float({ min: 0.01, max: 0.1 }));
            } else {
                orderPrice = currentPrice * (1 + faker.number.float({ min: 0.01, max: 0.1 }));
            }
        } else { // STOP
            // Prix stop (moins bon que le marché)
            if (side === OrderSide.BUY) {
                orderPrice = currentPrice * (1 + faker.number.float({ min: 0.01, max: 0.1 }));
            } else {
                orderPrice = currentPrice * (1 - faker.number.float({ min: 0.01, max: 0.1 }));
            }
        }

        // Statut de l'ordre (la majorité en attente)
        const status = faker.helpers.weightedArrayElement([
            { weight: 70, value: OrderStatus.OPEN },
            { weight: 20, value: OrderStatus.FILLED },
            { weight: 5, value: OrderStatus.CANCELLED },
            { weight: 5, value: OrderStatus.EXPIRED }
        ]);

        // Date d'expiration (pour certains ordres)
        const hasExpiry = faker.datatype.boolean(0.4); // 40% chance d'avoir une date d'expiration
        const expiresAt = hasExpiry ? faker.date.future({ years: 1 }) : null;

        return prisma.order.create({
            data: {
                userId: user.id,
                pokemonId: pokemon.id,
                type,
                side,
                quantity: faker.number.int({ min: 1, max: 10 }),
                price: orderPrice,
                status,
                expiresAt,
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent()
            }
        });
    });

    console.log(`✅ Créé ${orders.length} ordres d'achat et de vente`);

    // Créer les trades (échanges)
    console.log('🔄 Création des échanges...');
    const trades = await generateMany(NUM_TRADES, async () => {
        // Sélectionner deux utilisateurs différents
        const [sender, receiver] = pickRandomMany(allUsers, 2);

        if (sender.id === receiver.id) return null; // Ignorer si même utilisateur

        // Sélectionner des pokémons appartenant à l'expéditeur
        const senderPokemons = pokemons.filter(p => p.ownerId === sender.id);
        if (senderPokemons.length === 0) return null;

        const selectedSenderPokemons = pickRandomMany(
            senderPokemons,
            faker.number.int({ min: 1, max: Math.min(3, senderPokemons.length) })
        );

        // Sélectionner des pokémons appartenant au récepteur
        const receiverPokemons = pokemons.filter(p => p.ownerId === receiver.id);
        if (receiverPokemons.length === 0) return null;

        const selectedReceiverPokemons = pickRandomMany(
            receiverPokemons,
            faker.number.int({ min: 1, max: Math.min(3, receiverPokemons.length) })
        );

        // Créer le trade
        const tradeStatus = pickRandom([
            TradeStatus.PENDING,
            TradeStatus.COMPLETED,
            TradeStatus.CANCELLED
        ]);

        const trade = await prisma.trade.create({
            data: {
                senderId: sender.id,
                receiverId: receiver.id,
                status: tradeStatus,
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent()
            }
        });

        // Ajouter les pokémons à l'échange
        for (const pokemon of selectedSenderPokemons) {
            await prisma.tradePokemon.create({
                data: {
                    tradeId: trade.id,
                    pokemonId: pokemon.id,
                    createdAt: trade.createdAt
                }
            });
        }

        for (const pokemon of selectedReceiverPokemons) {
            await prisma.tradePokemon.create({
                data: {
                    tradeId: trade.id,
                    pokemonId: pokemon.id,
                    createdAt: trade.createdAt
                }
            });
        }

        // Créer une transaction si l'échange est complété
        if (tradeStatus === TradeStatus.COMPLETED) {
            const totalValue = [...selectedSenderPokemons, ...selectedReceiverPokemons]
                .reduce((sum, pokemon) => sum + pokemon.price, 0);

            await prisma.transaction.create({
                data: {
                    tradeId: trade.id,
                    senderId: sender.id,
                    receiverId: receiver.id,
                    amount: totalValue,
                    timestamp: faker.date.between({ from: trade.createdAt, to: trade.updatedAt }),
                }
            });
        }

        return trade;
    });

    const validTrades = trades.filter(Boolean);
    console.log(`✅ Créé ${validTrades.length} échanges`);

    // Créer des statistiques de marché
    console.log('📊 Création des statistiques de marché...');

    // Dernière semaine de données
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const topTraded = pickRandomMany(pokemons, 5).map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            volume: faker.number.int({ min: 10, max: 1000 }),
            priceChange: faker.number.float({ min: -10, max: 10 })
        }));

        await prisma.marketStatistics.create({
            data: {
                date,
                totalVolume: faker.number.int({ min: 1000, max: 10000 }),
                topTraded,
                priceIndex: 100 + faker.number.float({ min: -5, max: 5 })
            }
        });
    }

    console.log('✅ Créé des statistiques de marché pour les 7 derniers jours');
    console.log('✅ Seeding terminé !');
}

main()
    .catch((e) => {
        console.error('❌ Erreur pendant le seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 