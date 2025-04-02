import { PrismaClient, Condition, Role, TradeStatus, TradeDirection, Priority, Card } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Nombre d'éléments à générer
const NUM_USERS = 10;
const NUM_CARDS_PER_USER = 15;
const NUM_COLLECTIONS_PER_USER = 2;
const NUM_TRADES = 20;
const NUM_POSTS = 30;
const NUM_PRODUCTS = 15;

// Fonction utilitaire pour générer un tableau d'éléments
function generateMany<T>(num: number, generator: () => T): T[] {
    return Array.from({ length: num }, generator);
}

// Fonction utilitaire pour choisir un élément aléatoire dans un tableau
function pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Fonction utilitaire pour choisir plusieurs éléments aléatoires dans un tableau
function pickRandomMany<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Liste de noms de sets Pokémon
const pokemonSets = [
    'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Neo Genesis',
    'Neo Discovery', 'Neo Revelation', 'Neo Destiny', 'Legendary Collection',
    'Expedition Base Set', 'Aquapolis', 'Skyridge', 'Ruby & Sapphire',
    'Sword & Shield', 'Brilliant Stars', 'Astral Radiance', 'Silver Tempest',
    'Scarlet & Violet', 'Paldea Evolved', 'Obsidian Flames', 'Paradox Rift'
];

// Liste de raretés de cartes Pokémon
const rarities = [
    'Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare',
    'Rare Prism Star', 'V', 'VMAX', 'VSTAR', 'Illustration Rare', 'Gold Rare'
];

// Liste des conditions de cartes
const conditions = Object.values(Condition);

async function main() {
    console.log('🌱 Début du seeding...');

    // Nettoyer la base de données
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.tradeItem.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.card.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.post.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Créer les utilisateurs
    console.log('👤 Création des utilisateurs...');
    const users = await Promise.all(
        generateMany(NUM_USERS, () => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();

            return prisma.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
                    username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
                    password: faker.internet.password(),
                    image: faker.image.avatar(),
                    emailVerified: faker.date.past(),
                    role: Math.random() > 0.9 ? Role.ADMIN : Role.USER,
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
            });
        })
    );

    console.log(`✅ Créé ${users.length} utilisateurs`);

    // Créer les produits
    console.log('🏪 Création des produits...');
    const products = await Promise.all(
        generateMany(NUM_PRODUCTS, () => {
            return prisma.product.create({
                data: {
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    price: parseInt(faker.commerce.price({ min: 5, max: 200 })),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
            });
        })
    );

    console.log(`✅ Créé ${products.length} produits`);

    // Créer les posts
    console.log('📝 Création des posts...');
    const posts = await Promise.all(
        generateMany(NUM_POSTS, () => {
            const randomUser = pickRandom(users);

            return prisma.post.create({
                data: {
                    title: faker.lorem.sentence({ min: 3, max: 8 }),
                    content: faker.lorem.paragraphs({ min: 1, max: 5 }),
                    published: Math.random() > 0.3, // 70% publiés
                    authorId: randomUser.id,
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
            });
        })
    );

    console.log(`✅ Créé ${posts.length} posts`);

    // Créer les cartes
    console.log('🃏 Création des cartes...');
    const cards: Card[] = [];

    for (const user of users) {
        const userCards = await Promise.all(
            generateMany(NUM_CARDS_PER_USER, () => {
                const pokemonName = faker.animal.type() + faker.person.suffix();
                const setName = pickRandom(pokemonSets);
                const setNumber = `${faker.number.int({ min: 1, max: 300 })}/${faker.number.int({ min: 300, max: 400 })}`;

                return prisma.card.create({
                    data: {
                        name: pokemonName,
                        setName: setName,
                        setNumber: setNumber,
                        rarity: pickRandom(rarities),
                        image: faker.image.urlLoremFlickr({ category: 'pokemon' }),
                        description: faker.lorem.sentence(),
                        price: parseFloat(faker.commerce.price({ min: 1, max: 500 })),
                        condition: pickRandom(conditions),
                        sellable: Math.random() > 0.5,
                        tradable: Math.random() > 0.5,
                        ownerId: user.id,
                        createdAt: faker.date.past(),
                        updatedAt: faker.date.recent(),
                    },
                });
            })
        );

        cards.push(...userCards);
    }

    console.log(`✅ Créé ${cards.length} cartes`);

    // Créer les collections
    console.log('📚 Création des collections...');
    const collections = [];

    for (const user of users) {
        const userCollections = await Promise.all(
            generateMany(NUM_COLLECTIONS_PER_USER, () => {
                // Sélectionner aléatoirement des cartes appartenant à l'utilisateur
                const userCards = cards.filter(card => card.ownerId === user.id);
                const selectedCards = pickRandomMany(userCards, Math.floor(userCards.length / 2));

                return prisma.collection.create({
                    data: {
                        name: faker.lorem.words({ min: 1, max: 3 }),
                        description: faker.lorem.sentence(),
                        isPrivate: Math.random() > 0.7,
                        userId: user.id,
                        createdAt: faker.date.past(),
                        updatedAt: faker.date.recent(),
                        cards: {
                            connect: selectedCards.map(card => ({ id: card.id })),
                        }
                    },
                });
            })
        );

        collections.push(...userCollections);
    }

    console.log(`✅ Créé ${collections.length} collections`);

    // Créer les wishlists
    console.log('🌠 Création des wishlists...');
    const wishlists = await Promise.all(
        users.map(async (user) => {
            // Sélectionner aléatoirement des cartes qui n'appartiennent pas à l'utilisateur
            const otherCards = cards.filter(card => card.ownerId !== user.id);
            const selectedCards = pickRandomMany(otherCards, Math.floor(Math.random() * 10) + 1);

            const wishlist = await prisma.wishlist.create({
                data: {
                    userId: user.id,
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
            });

            // Créer les éléments de wishlist
            await Promise.all(
                selectedCards.map(card => {
                    return prisma.wishlistItem.create({
                        data: {
                            wishlistId: wishlist.id,
                            cardId: card.id,
                            priority: pickRandom(Object.values(Priority)),
                            createdAt: faker.date.past(),
                        },
                    });
                })
            );

            return wishlist;
        })
    );

    console.log(`✅ Créé ${wishlists.length} wishlists`);

    // Créer les échanges
    console.log('🔄 Création des échanges...');
    const trades = await Promise.all(
        generateMany(NUM_TRADES, async () => {
            // Sélectionner deux utilisateurs différents
            const [initiator, receiver] = pickRandomMany(users, 2);

            // Sélectionner des cartes appartenant à l'initiateur
            const initiatorCards = cards.filter(card => card.ownerId === initiator.id && card.tradable);
            const selectedInitiatorCards = pickRandomMany(
                initiatorCards,
                Math.min(Math.floor(Math.random() * 3) + 1, initiatorCards.length)
            );

            // Sélectionner des cartes appartenant au récepteur
            const receiverCards = cards.filter(card => card.ownerId === receiver.id && card.tradable);
            const selectedReceiverCards = pickRandomMany(
                receiverCards,
                Math.min(Math.floor(Math.random() * 3) + 1, receiverCards.length)
            );

            if (selectedInitiatorCards.length === 0 || selectedReceiverCards.length === 0) {
                // Skip si pas assez de cartes
                return null;
            }

            const trade = await prisma.trade.create({
                data: {
                    initiatorId: initiator.id,
                    receiverId: receiver.id,
                    status: pickRandom(Object.values(TradeStatus)),
                    message: faker.lorem.sentence(),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
            });

            // Créer les éléments d'échange: offres
            await Promise.all(
                selectedInitiatorCards.map(card => {
                    return prisma.tradeItem.create({
                        data: {
                            tradeId: trade.id,
                            cardId: card.id,
                            direction: TradeDirection.OFFER,
                        },
                    });
                })
            );

            // Créer les éléments d'échange: demandes
            await Promise.all(
                selectedReceiverCards.map(card => {
                    return prisma.tradeItem.create({
                        data: {
                            tradeId: trade.id,
                            cardId: card.id,
                            direction: TradeDirection.REQUEST,
                        },
                    });
                })
            );

            return trade;
        })
    );

    // Filtrer les échanges nuls (ceux qui n'ont pas pu être créés)
    const validTrades = trades.filter(trade => trade !== null);

    console.log(`✅ Créé ${validTrades.length} échanges`);

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