// prisma/seed.ts

import argon2 from 'argon2';
// Modifiez la ligne d'importation pour inclure les types de modèles directement
import { PrismaClient, Prisma, Category, Ingredient, Movie, User, Recipe } from '../generated/prisma';

// Déclarer l'instance de PrismaClient en dehors de la fonction 'main'
const prisma = new PrismaClient(); // Correction TS2304: Déclaration globale

async function main() {
  console.log('Début du seeding de la base de données...');

  // ... (Création d'un utilisateur admin) ...
  const hashedPasswordAdmin = await argon2.hash('Admin@123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cine-delices.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Maître',
      email: 'admin@cine-delices.com',
      password: hashedPasswordAdmin,
      isAdmin: true,
    },
  });
  console.log(`Utilisateur Admin créé/mis à jour: ${adminUser.email}`);

  // --- 1. Création de catégories ---
  const categoriesData = [
    { name: 'Plats Principaux' },
    { name: 'Desserts' },
    { name: 'Entrées' },
    { name: 'Boissons' },
    { name: 'Snacks' },
  ];

  const johnDoe = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: await argon2.hash('PasswordUser123!'),
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  const janeSmith = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: await argon2.hash('Jane123!'),
      firstName: 'Jane',
      lastName: 'Smith',
    },
  });
  console.log('Utilisateurs créés.');

  // --- 2. Catégories ---
  const entreeCat = await prisma.category.create({ data: { name: 'Entrée' } });
  const platCat = await prisma.category.create({ data: { name: 'Plat' } });
  const dessertCat = await prisma.category.create({ data: { name: 'Dessert' } });
  const boissonCat = await prisma.category.create({ data: { name: 'Boisson' } });
  console.log('Catégories créées.');

  // --- 3. Ingrédients ---
  const ingredientNames = [
    'Tomate', 'Oignon', 'Ail', 'Huile d\'olive', 'Farine', 'Sucre', 'Ricotta', 'Ananas', 'Steak haché',
    'Pain burger', 'Fromage cheddar', 'Chocolat Noir', 'Saucisse de Morteau', 'Pâte brisée', 'Oeuf',
    'Crème fraîche', 'Crevette', 'Beurre', 'Persil', 'Lait de coco', 'Colorant alimentaire bleu',
    'Porc haché', 'Gingembre', 'Sauce soja', 'Gin', 'Jus de cranberry', 'Pomme', 'Saumon'
  ];

  const ingredients = await Promise.all(
    ingredientsData.map(data =>
      prisma.ingredient.upsert({
        where: { name: data.name },
        update: {},
        create: data,
      })
    )
  );
  console.log(`Création/Mise à jour de ${ingredients.length} ingrédients.`);

  // --- 3. Création d'un utilisateur régulier ---
  const hashedPasswordUser = await argon2.hash('User@123');
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@cine-delices.com' },
    update: {},
    create: {
      firstName: 'Utilisateur',
      lastName: 'Lambda',
      email: 'user@cine-delices.com',
      password: hashedPasswordUser,
      isAdmin: false,
    },
  });
  console.log(`Utilisateur régulier créé/mis à jour: ${regularUser.email}`);

  // ... (Création de films) ...

  // --- 4. Création de films ---
  const moviesData = [
    {
      title: 'Le Seigneur des Anneaux : La Communauté de l\'Anneau',
      description: 'Un hobbit hérite d\'un puissant anneau et doit le détruire pour sauver la Terre du Milieu.',
      imdbLink: 'https://www.imdb.com/title/tt0120737/',
      releaseDate: new Date('2001-12-19T00:00:00Z'),
    },
    {
      title: 'Ratatouille',
      description: 'Un jeune rat doté d\'un palais et d\'un odorat développés rêve de devenir un grand chef français.',
      imdbLink: 'https://www.imdb.com/title/tt0382932/',
      releaseDate: new Date('2007-06-29T00:00:00Z'),
    },
    {
      title: 'Pulp Fiction',
      description: 'Les vies de deux tueurs à gages, d\'un boxeur, d\'un gangster et de sa femme se croisent dans une série d\'événements violents et comiques.',
      imdbLink: 'https://www.imdb.com/title/tt0110912/',
      releaseDate: new Date('1994-05-21T00:00:00Z'),
    },
  });

  // 6
  await prisma.recipe.create({
    data: {
      title: 'Crevettes à l\'Ail "Bubba Gump"',
      duration: 25,
      difficulty: 2,
      image: 'http://localhost:3001/images-recettes/poulet-aux-morilles.webp',
      quote: 'La vie, c\'est comme une boîte de chocolats...',
      isValidated: true,
      description: `Une variation des crevettes à l'ail et au beurre, simple et délicieuse.
Instructions :
- Faites fondre du beurre avec de l'ail haché.
- Jetez-y des grosses crevettes décortiquées.
- Faites cuire 1 à 2 minutes de chaque côté.
- Déglacez avec du jus de citron, ajoutez du persil frais.`,
      author: { connect: { id: johnDoe.id } },
      category: { connect: { id: entreeCat.id } },
      movie: { connect: { id: gumpMovie.id } },
      ingredients: {
        create: [
          { unit: 'unité', quantity: 8, ingredient: { connect: { name: 'Crevette' } } },
          { unit: 'gousse', quantity: 2, ingredient: { connect: { name: 'Ail' } } },
          { unit: 'g', quantity: 20, ingredient: { connect: { name: 'Beurre' } } },
          { unit: 'g', quantity: 10, ingredient: { connect: { name: 'Persil' } } },
        ],
      },
    },
  });

  // 7
  await prisma.recipe.create({
    data: {
      title: 'Le Lait Bleu de Bantha',
      duration: 5,
      difficulty: 1,
      image: 'http://localhost:3001/images-recettes/biereaubeurre.webp',
      quote: 'Ces droïdes... ils sont en vente ?',
      isValidated: true,
      description: `La boisson rafraîchissante de la ferme des Lars sur Tatooine.
Instructions :
- Dans un blender, versez 250ml de lait de coco.
- Ajoutez du jus d'ananas et un trait de jus de citron.
- Incorporez quelques gouttes de colorant alimentaire bleu.
- Mixez et servez frais.`,
      author: { connect: { id: janeSmith.id } },
      category: { connect: { id: boissonCat.id } },
      movie: { connect: { id: starWarsMovie.id } },
      ingredients: {
        create: [
          { unit: 'cl', quantity: 25, ingredient: { connect: { name: 'Lait de coco' } } },
          { unit: 'tranche', quantity: 1, ingredient: { connect: { name: 'Ananas' } } },
          { unit: 'pincée', quantity: 1, ingredient: { connect: { name: 'Colorant alimentaire bleu' } } },
        ],
      },
    },
  });

  // 8
  await prisma.recipe.create({
    data: {
      title: 'Brioche "Sans-Visage"',
      duration: 120,
      difficulty: 4,
      image: 'http://localhost:3001/images-recettes/Saumon_en_croute.webp',
      quote: 'Ah... Ah...',
      isValidated: true,
      description: `Un pain au lait japonais (nikuman) doux et réconfortant.
Instructions :
- Préparez une pâte à brioche et laissez-la lever.
- Préparez une farce à base de porc haché, gingembre et sauce soja.
- Formez des boules de pâte, garnissez-les et refermez-les.
- Faites cuire les brioches à la vapeur pendant 15 minutes.`,
      author: { connect: { id: adminUser.id } },
      category: { connect: { id: entreeCat.id } },
      movie: { connect: { id: chihiroMovie.id } },
      ingredients: {
        create: [
          { unit: 'g', quantity: 250, ingredient: { connect: { name: 'Farine' } } },
          { unit: 'g', quantity: 200, ingredient: { connect: { name: 'Porc haché' } } },
          { unit: 'g', quantity: 5, ingredient: { connect: { name: 'Gingembre' } } },
          { unit: 'ml', quantity: 10, ingredient: { connect: { name: 'Sauce soja' } } },
        ],
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Ratatouille créée.');

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });