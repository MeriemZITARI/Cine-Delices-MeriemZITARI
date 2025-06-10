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

  const categories = await Promise.all(
    categoriesData.map(async data => {
      const existingCategory = await prisma.category.findFirst({
        where: { name: data.name }
      });
      if (existingCategory) {
        return existingCategory;
      }
      return prisma.category.create({ data });
    })
  );
  console.log(`Création/Mise à jour de ${categories.length} catégories.`);

  // --- 2. Création d'ingrédients ---
  const ingredientsData = [
    { name: 'Farine' }, { name: 'Sucre' }, { name: 'Oeufs' }, { name: 'Beurre' },
    { name: 'Lait' }, { name: 'Chocolat Noir' }, { name: 'Tomate' }, { name: 'Fromage' },
    { name: 'Pâte à Pizza' }, { name: 'Basilic' }, { name: 'Piment' }, { name: 'Viande Hachée' },
    { name: 'Oignon' }, { name: 'Ail' }, { name: 'Pâtes' }, { name: 'Sel' },
    { name: 'Poivre' }, { name: "Huile d'olive" }, { name: 'Champignons' }, { name: 'Poivron' },
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
  ];

  const movies = await Promise.all(
    moviesData.map(async data => {
      const existingMovie = await prisma.movie.findFirst({ where: { title: data.title } });
      if (existingMovie) {
        return existingMovie;
      }
      return prisma.movie.create({ data });
    })
  );
  console.log(`Création de ${movies.length} films.`);


  // --- 5. Création de recettes ---
  // Récupérer des IDs pour les relations (maintenant, on utilise les types directement)
  // Correction TS7006: typage explicite des paramètres dans find()
  const mainDishCategory = categories.find((c: Category) => c.name === 'Plats Principaux'); // <-- UTILISE Category directement
  const dessertCategory = categories.find((c: Category) => c.name === 'Desserts'); // <-- UTILISE Category directement

  const flour = ingredients.find((i: Ingredient) => i.name === 'Farine'); // <-- UTILISE Ingredient directement
  const sugar = ingredients.find((i: Ingredient) => i.name === 'Sucre'); // <-- UTILISE Ingredient directement
  const eggs = ingredients.find((i: Ingredient) => i.name === 'Oeufs'); // <-- UTILISE Ingredient directement
  const chocolate = ingredients.find((i: Ingredient) => i.name === 'Chocolat Noir');
  const tomato = ingredients.find((i: Ingredient) => i.name === 'Tomate');
  const cheese = ingredients.find((i: Ingredient) => i.name === 'Fromage');
  const pizzaDough = ingredients.find((i: Ingredient) => i.name === 'Pâte à Pizza');
  const basil = ingredients.find((i: Ingredient) => i.name === 'Basilic');
  const chili = ingredients.find((i: Ingredient) => i.name === 'Piment');
  const mincedMeat = ingredients.find((i: Ingredient) => i.name === 'Viande Hachée');
  const onion = ingredients.find((i: Ingredient) => i.name === 'Oignon');
  const garlic = ingredients.find((i: Ingredient) => i.name === 'Ail');
  const pasta = ingredients.find((i: Ingredient) => i.name === 'Pâtes');
  const pepper = ingredients.find((i: Ingredient) => i.name === 'Poivron');
  const butter = ingredients.find((i: Ingredient) => i.name === 'Beurre');
  const milk = ingredients.find((i: Ingredient) => i.name === 'Lait');
  const oliveOil = ingredients.find((i: Ingredient) => i.name === "Huile d'olive");


  const lotrMovie = movies.find((m: Movie) => m.title.includes('Seigneur des Anneaux')); // <-- UTILISE Movie directement
  const ratatouilleMovie = movies.find((m: Movie) => m.title.includes('Ratatouille')); // <-- UTILISE Movie directement

  if (!mainDishCategory || !dessertCategory || !flour || !sugar || !eggs || !chocolate || !tomato || !cheese || !pizzaDough || !basil || !chili || !mincedMeat || !onion || !garlic || !pasta || !lotrMovie || !ratatouilleMovie || !pepper || !butter || !milk || !oliveOil) {
    console.error('Erreur: Impossible de trouver toutes les catégories/ingrédients/films nécessaires pour les recettes. Veuillez vérifier le seeding des éléments de base.');
    if (!mainDishCategory) console.error("Catégorie 'Plats Principaux' manquante.");
    if (!dessertCategory) console.error("Catégorie 'Desserts' manquante.");
    if (!flour) console.error("Ingrédient 'Farine' manquant.");
    if (!sugar) console.error("Ingrédient 'Sucre' manquant.");
    if (!eggs) console.error("Ingrédient 'Oeufs' manquant.");
    if (!chocolate) console.error("Ingrédient 'Chocolat Noir' manquant.");
    if (!tomato) console.error("Ingrédient 'Tomate' manquant.");
    if (!cheese) console.error("Ingrédient 'Fromage' manquant.");
    if (!pizzaDough) console.error("Ingrédient 'Pâte à Pizza' manquant.");
    if (!basil) console.error("Ingrédient 'Basilic' manquant.");
    if (!chili) console.error("Ingrédient 'Piment' manquant.");
    if (!mincedMeat) console.error("Ingrédient 'Viande Hachée' manquant.");
    if (!onion) console.error("Ingrédient 'Oignon' manquant.");
    if (!garlic) console.error("Ingrédient 'Ail' manquant.");
    if (!pasta) console.error("Ingrédient 'Pâtes' manquant.");
    if (!pepper) console.error("Ingrédient 'Poivron' manquant.");
    if (!butter) console.error("Ingrédient 'Beurre' manquant.");
    if (!milk) console.error("Ingrédient 'Lait' manquant.");
    if (!oliveOil) console.error("Ingrédient 'Huile d'olive' manquant.");
    if (!lotrMovie) console.error("Film 'Le Seigneur des Anneaux' manquant.");
    if (!ratatouilleMovie) console.error("Film 'Ratatouille' manquant.");
    return;
  }

  // --- Création des recettes ---
  let recipe1 = await prisma.recipe.findFirst({ where: { title: 'Pains de Lembas (Recette elfique)' } });
  if (!recipe1) {
    recipe1 = await prisma.recipe.create({
      data: {
        title: 'Pains de Lembas (Recette elfique)',
        description: 'Le pain de route des Elfes, un petit morceau suffit à remplir l\'estomac d\'un voyageur. Parfait pour les aventures.',
        duration: 60,
        difficulty: 2,
        image: 'https://cdn.pixabay.com/photo/2016/09/16/16/05/bread-1673898_1280.jpg',
        quote: 'Un petit morceau suffit à remplir l\'estomac d\'un adulte.',
        isValidated: true,
        
        userId: adminUser.id,
        categoryId: dessertCategory.id,
        movieId: lotrMovie.id,
        
        ingredients: {
          create: [
            { quantity: 250, unit: 'g', ingredientId: flour.id },
            { quantity: 100, unit: 'g', ingredientId: sugar.id },
            { quantity: 2, unit: 'unité', ingredientId: eggs.id },
            { quantity: 50, unit: 'g', ingredientId: butter.id },
            { quantity: 100, unit: 'ml', ingredientId: milk.id },
          ],
        },
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Lembas créée.');

  let recipe2 = await prisma.recipe.findFirst({ where: { title: 'Ratatouille de Rémy' } });
  if (!recipe2) {
    recipe2 = await prisma.recipe.create({
      data: {
        title: 'Ratatouille de Rémy',
        description: 'Une ratatouille fraîche et colorée, digne des plus grands restaurants parisiens, avec la touche secrète de Rémy.',
        duration: 90,
        difficulty: 4,
        image: 'https://cdn.pixabay.com/photo/2014/12/21/23/28/ratatouille-575037_1280.jpg',
        quote: 'La cuisine est un art, et l\'art est une aventure.',
        isValidated: true,
        
        userId: regularUser.id,
        categoryId: mainDishCategory.id,
        movieId: ratatouilleMovie.id,
        
        ingredients: {
          create: [
            { quantity: 2, unit: 'unité', ingredientId: tomato.id },
            { quantity: 1, unit: 'unité', ingredientId: onion.id },
            { quantity: 2, unit: 'unité', ingredientId: garlic.id },
            { quantity: 1, unit: 'unité', ingredientId: pepper.id },
            { quantity: 30, unit: 'ml', ingredientId: oliveOil.id },
          ],
        },
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Ratatouille créée.');

  console.log('Seeding terminé.');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });