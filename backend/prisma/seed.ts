import { PrismaClient } from '../generated/prisma';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log(`Début du seeding...`);

  // --- 1. Utilisateurs ---
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cine-delices.com',
      password: await argon2.hash('PasswordAdmin123!'),
      firstName: 'Admin',
      lastName: 'Maître',
      isAdmin: true,
    },
  });

<<<<<<< HEAD
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
    { name: 'Crème' }, { name: 'Saumon' }, { name: 'Riz' }, { name: 'Citron' },
    { name: 'Pomme de terre' }, { name: 'Carotte' }, { name: 'Thym' }, { name: 'Romarin' },
    { name: 'Vanille' }, { name: 'Cannelle' }, { name: 'Courgette' }, { name: 'Aubergine' },
    { name: 'Vin Rouge' }, { name: 'Bouillon' }, { name: 'Noix de Muscade' }, { name: 'Persil' },
    { name: 'Poulet' }, { name: 'Miel' }, { name: 'Pomme' }, { name: 'Caramel' },
    { name: 'Potiron' }, { name: 'Courge' }, { name: 'Muscade' }
=======
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
>>>>>>> 00c42826bb691a94be518b0a17ebae59416becca
  ];
  for (const name of ingredientNames) {
    await prisma.ingredient.create({ data: { name } });
  }
  console.log(`${ingredientNames.length} ingrédients créés.`);

  // --- 4. Films ---
  const ratatouilleMovie = await prisma.movie.create({ data: { title: 'Ratatouille', releaseDate: new Date('2007-08-01'), description: 'Un jeune rat rêve de devenir chef.', imdbLink: 'tt0382932' } });
  const parrainMovie = await prisma.movie.create({ data: { title: 'Le Parrain', releaseDate: new Date('1972-10-18'), description: 'La saga de la famille Corleone.', imdbLink: 'tt0068646' } });
  const pulpFictionMovie = await prisma.movie.create({ data: { title: 'Pulp Fiction', releaseDate: new Date('1994-10-26'), description: 'Les vies entremêlées de personnages hauts en couleur.', imdbLink: 'tt0110912' } });
  const chocoMovie = await prisma.movie.create({ data: { title: 'Charlie et la chocolaterie', releaseDate: new Date('2005-07-13'), description: 'Un jeune garçon gagne une visite de la chocolaterie magique.', imdbLink: 'tt0367594' } });
  const citePeurMovie = await prisma.movie.create({ data: { title: 'La Cité de la peur', releaseDate: new Date('1994-03-09'), description: 'Une comédie culte sur un tueur en série à Cannes.', imdbLink: 'tt0109440' } });
  const gumpMovie = await prisma.movie.create({ data: { title: 'Forrest Gump', releaseDate: new Date('1994-10-05'), description: 'Les tribulations d\'un homme simple à travers l\'histoire américaine.', imdbLink: 'tt0109830' } });
  const starWarsMovie = await prisma.movie.create({ data: { title: 'Star Wars: Un nouvel espoir', releaseDate: new Date('1977-10-19'), description: 'Un jeune fermier rejoint la Rébellion pour sauver la galaxie.', imdbLink: 'tt0076759' } });
  const chihiroMovie = await prisma.movie.create({ data: { title: 'Le Voyage de Chihiro', releaseDate: new Date('2002-04-10'), description: 'Une fillette erre dans un monde d\'esprits.', imdbLink: 'tt0245429' } });
  const indianaMovie = await prisma.movie.create({ data: { title: 'Les Aventuriers de l\'Arche perdue', releaseDate: new Date('1981-09-16'), description: 'Un archéologue aventurier affronte les nazis.', imdbLink: 'tt0082971' } });
  console.log('Films créés.');

  // --- 5. RECETTES ---

  // 1
  await prisma.recipe.create({
    data: {
      title: 'Ratatouille comme Rémy',
      duration: 75,
      difficulty: 3,
      image: 'http://localhost:3001/images-recettes/ratatouille.webp',
      quote: 'Tout le monde peut cuisiner.',
      isValidated: true,
      description: `Un plat de légumes provençal fondant, présenté avec l'élégance d'un grand chef.
Instructions :
- Coupez finement 1 aubergine, 1 courgette et 2 tomates en rondelles.
- Préparez une piperade avec des oignons et de l'ail.
- Disposez les légumes en spirale sur la piperade et enfournez.`,
      author: { connect: { id: johnDoe.id } },
      category: { connect: { id: platCat.id } },
      movie: { connect: { id: ratatouilleMovie.id } },
      ingredients: {
        create: [
          { unit: 'unité', quantity: 3, ingredient: { connect: { name: 'Tomate' } } },
          { unit: 'unité', quantity: 1, ingredient: { connect: { name: 'Oignon' } } },
          { unit: 'gousse', quantity: 2, ingredient: { connect: { name: 'Ail' } } },
        ],
      },
    },
  });

  // 2
  await prisma.recipe.create({
    data: {
      title: 'Cannoli Siciliens du Parrain',
      duration: 60,
      difficulty: 4,
      image: 'http://localhost:3001/images-recettes/boeuf_bourguignon.webp',
      quote: 'Laisse le flingue, prends les cannoli.',
      isValidated: true,
      description: `La pâtisserie sicilienne par excellence, croustillante et crémeuse.
Instructions :
- Préparez la pâte avec de la farine et du sucre.
- Faites frire les coques pour qu'elles soient croustillantes.
- Préparez la garniture à base de ricotta fraîche.`,
      author: { connect: { id: adminUser.id } },
      category: { connect: { id: dessertCat.id } },
      movie: { connect: { id: parrainMovie.id } },
      ingredients: {
        create: [
          { unit: 'g', quantity: 250, ingredient: { connect: { name: 'Farine' } } },
          { unit: 'g', quantity: 150, ingredient: { connect: { name: 'Sucre' } } },
          { unit: 'g', quantity: 500, ingredient: { connect: { name: 'Ricotta' } } },
        ],
      },
    },
  });

  // 3
  await prisma.recipe.create({
    data: {
      title: 'Le Big Kahuna Burger',
      duration: 30,
      difficulty: 2,
      image: 'http://localhost:3001/images-recettes/caille-sarcophage.webp',
      quote: 'C\'est une excellente bière pour accompagner un hamburger !',
      isValidated: true,
      description: `Le fameux burger hawaïen de Pulp Fiction, un délice sucré-salé.
Instructions :
- Faites griller une tranche d'ananas.
- Faites cuire votre steak haché avec une tranche de fromage cheddar.
- Montez le burger : pain, steak, fromage, ananas grillé, et sauce teriyaki.`,
      author: { connect: { id: johnDoe.id } },
      category: { connect: { id: platCat.id } },
      movie: { connect: { id: pulpFictionMovie.id } },
      ingredients: {
        create: [
          { unit: 'unité', quantity: 1, ingredient: { connect: { name: 'Steak haché' } } },
          { unit: 'unité', quantity: 2, ingredient: { connect: { name: 'Pain burger' } } },
          { unit: 'rondelle', quantity: 1, ingredient: { connect: { name: 'Ananas' } } },
          { unit: 'tranche', quantity: 1, ingredient: { connect: { name: 'Fromage cheddar' } } },
        ],
      },
    },
  });

  // 4
  await prisma.recipe.create({
    data: {
      title: 'Carré de Chocolat Infini',
      duration: 5,
      difficulty: 1,
      image: 'http://localhost:3001/images-recettes/chocolat_chaud.webp',
      quote: 'L\'imagination est le début de la création.',
      isValidated: true,
      description: `Un dessert simple et magique inspiré par la chocolaterie de Willy Wonka.
Instructions :
- Prenez un carré de votre meilleur chocolat noir (70% minimum).
- Dégustez lentement.`,
      author: { connect: { id: adminUser.id } },
      category: { connect: { id: dessertCat.id } },
      movie: { connect: { id: chocoMovie.id } },
      ingredients: {
        create: [
          { unit: 'g', quantity: 40, ingredient: { connect: { name: 'Chocolat Noir' } } },
        ],
      },
    },
  });

  // 5
  await prisma.recipe.create({
    data: {
      title: 'La Tarte à la Godiveau',
      duration: 50,
      difficulty: 2,
      image: 'http://localhost:3001/images-recettes/pains_Lemba.webp',
      quote: 'Vous pouvez tromper une personne une fois...',
      isValidated: true,
      description: `Spécialité de la Cité de la Peur, tarte à la saucisse de Morteau.
Instructions :
- Foncez un moule avec une pâte brisée.
- Faites revenir des oignons et des rondelles de saucisse.
- Versez un appareil à quiche (3 oeufs, 20cl de crème).
- Enfournez 30-35 minutes à 190°C.`,
      author: { connect: { id: janeSmith.id } },
      category: { connect: { id: platCat.id } },
      movie: { connect: { id: citePeurMovie.id } },
      ingredients: {
        create: [
          { unit: 'unité', quantity: 1, ingredient: { connect: { name: 'Pâte brisée' } } },
          { unit: 'unité', quantity: 2, ingredient: { connect: { name: 'Oignon' } } },
          { unit: 'unité', quantity: 1, ingredient: { connect: { name: 'Saucisse de Morteau' } } },
          { unit: 'unité', quantity: 3, ingredient: { connect: { name: 'Oeuf' } } },
          { unit: 'cl', quantity: 20, ingredient: { connect: { name: 'Crème fraîche' } } },
        ],
      },
    },
<<<<<<< HEAD
    {
      title: 'Le Festin de Babette',
      description: 'Une réfugiée française devient cuisinière pour deux sœurs pieuses et prépare un festin somptueux qui change leur vie.',
      imdbLink: 'https://www.imdb.com/title/tt0092603/',
      releaseDate: new Date('1987-08-28T00:00:00Z'),
    },
    {
      title: 'Comme un Chef',
      description: 'Un jeune cuisinier talentueux et autodidacte doit collaborer avec un chef étoilé pour sauver son restaurant.',
      imdbLink: 'https://www.imdb.com/title/tt1911553/',
      releaseDate: new Date('2012-07-11T00:00:00Z'),
    },
    {
      title: 'Les Saveurs du Palais',
      description: 'L\'histoire de la cuisinière personnelle du président de la République, confrontée aux défis de la cuisine de l\'Élysée.',
      imdbLink: 'https://www.imdb.com/fr/title/tt2094877/',
      releaseDate: new Date('2012-09-19T00:00:00Z'),
    },
    {
      title: 'Harry Potter à l\'école des sorciers',
      description: 'Un jeune sorcier découvre ses pouvoirs et un monde magique extraordinaire.',
      imdbLink: 'https://www.imdb.com/title/tt0241527/',
      releaseDate: new Date('2001-11-16T00:00:00Z'),
    },
    {
      title: 'Chocolat',
      description: 'Une femme ouvre une chocolaterie dans un petit village français, bouleversant la vie tranquille des habitants.',
      imdbLink: 'https://www.imdb.com/title/tt0241303/',
      releaseDate: new Date('2000-12-15T00:00:00Z'),
    },
    {
      title: 'Julie & Julia',
      description: 'L\'histoire parallèle de Julia Child et Julie Powell, explorant l\'art de la cuisine française.',
      imdbLink: 'https://www.imdb.com/title/tt1135503/',
      releaseDate: new Date('2009-08-07T00:00:00Z'),
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
  const cream = ingredients.find((i: Ingredient) => i.name === "Crème");
  const salmon = ingredients.find((i: Ingredient) => i.name === "Saumon");
  const rice = ingredients.find((i: Ingredient) => i.name === "Riz");
  const lemon = ingredients.find((i: Ingredient) => i.name === "Citron");
  const potato = ingredients.find((i: Ingredient) => i.name === "Pomme de terre");
  const carrot = ingredients.find((i: Ingredient) => i.name === "Carotte");
  const thyme = ingredients.find((i: Ingredient) => i.name === "Thym");
  const rosemary = ingredients.find((i: Ingredient) => i.name === "Romarin");
  const vanilla = ingredients.find((i: Ingredient) => i.name === "Vanille");
  const cinnamon = ingredients.find((i: Ingredient) => i.name === "Cannelle");
  const pumpkin = ingredients.find((i: Ingredient) => i.name === "Potiron");
  const apple = ingredients.find((i: Ingredient) => i.name === "Pomme");
  const nutmeg = ingredients.find((i: Ingredient) => i.name === "Noix de Muscade");
  const bouillon = ingredients.find((i: Ingredient) => i.name === "Bouillon");
  const mushrooms = ingredients.find((i: Ingredient) => i.name === "Champignons");

  const lotrMovie = movies.find((m: Movie) => m.title.includes('Seigneur des Anneaux')); // <-- UTILISE Movie directement
  const ratatouilleMovie = movies.find((m: Movie) => m.title.includes('Ratatouille')); // <-- UTILISE Movie directement
  const harryPotterMovie = movies.find((m: Movie) => m.title.includes('Harry Potter'));
  const chocolatMovie = movies.find((m: Movie) => m.title.includes('Chocolat'));
  const julieJuliaMovie = movies.find((m: Movie) => m.title.includes('Julie & Julia'));

  if (!mainDishCategory || !dessertCategory || !flour || !sugar || !eggs || !chocolate || !tomato || !cheese || 
      !pizzaDough || !basil || !chili || !mincedMeat || !onion || !garlic || !pasta || !lotrMovie || 
      !ratatouilleMovie || !pepper || !butter || !milk || !oliveOil || !cream || !salmon || !lemon || 
      !thyme || !rosemary || !vanilla || !cinnamon || !pumpkin || !apple || !nutmeg || !bouillon || !mushrooms) {
    console.error('Erreur: Impossible de trouver toutes les catégories/ingrédients/films nécessaires pour les recettes.');
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
    if (!cream) console.error("Ingrédient 'Crème' manquant.");
    if (!salmon) console.error("Ingrédient 'Saumon' manquant.");
    if (!lemon) console.error("Ingrédient 'Citron' manquant.");
    if (!thyme) console.error("Ingrédient 'Thym' manquant.");
    if (!rosemary) console.error("Ingrédient 'Romarin' manquant.");
    if (!vanilla) console.error("Ingrédient 'Vanille' manquant.");
    if (!cinnamon) console.error("Ingrédient 'Cannelle' manquant.");
    if (!pumpkin) console.error("Ingrédient 'Potiron' manquant.");
    if (!apple) console.error("Ingrédient 'Pomme' manquant.");
    if (!nutmeg) console.error("Ingrédient 'Noix de Muscade' manquant.");
    if (!bouillon) console.error("Ingrédient 'Bouillon' manquant.");
    if (!mushrooms) console.error("Ingrédient 'Champignons' manquant.");
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
        description: `1. Prechauffez le four a 180 degres.
2. Melangez la farine et le sucre.
3. Ajoutez les oeufs battus et le beurre fondu.
4. Incorporez progressivement le lait pour former une pate lisse.
5. Formez des petits pains ovales.
6. Faites cuire 20-25 minutes jusqu'a ce qu'ils soient dores.
7. Laissez refroidir et enveloppez dans des feuilles de mallorn.`,
        duration: 60,
        difficulty: 2,
        image: 'http://localhost:3001/images-recettes/pains_Lemba.webp',
        quote: 'Un seul petit morceau suffit à nourrir un homme adulte pour toute une journée de marche. Les Elfes nous en ont fait don. - Legolas',
        
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
        description: '1. Lavez et coupez tous les légumes en fines tranches.\n2. Faites revenir l\'oignon et l\'ail.\n3. Disposez les tranches de légumes en cercles concentriques.\n4. Assaisonnez d\'huile d\'olive, sel, poivre et herbes.\n5. Couvrez et laissez mijoter à feu doux 45 minutes.\n6. Terminez par 10 minutes au four pour caraméliser.',
        duration: 90,
        difficulty: 4,
        image: 'http://localhost:3001/images-recettes/ratatouille.webp',
        quote: 'N\'importe qui peut cuisiner, mais seul un grand chef peut cuisiner avec son cœur. - Chef Auguste Gusteau',
        
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
=======
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
>>>>>>> 00c42826bb691a94be518b0a17ebae59416becca
      },
    },
  });

  // 9
  await prisma.recipe.create({
    data: {
      title: 'Le Tournedos de François Pignon',
      duration: 25,
      difficulty: 2,
      image: 'http://localhost:3001/images-recettes/Tarte_pommes.webp',
      quote: 'Il a une belle couleur, ce porto.',
      isValidated: true,
      description: `Un plat simple mais qui peut causer des problèmes de dos si on est trop généreux avec la sauce.
Instructions :
- Saisir un beau tournedos de boeuf à la poêle.
- Préparer une sauce au poivre avec crème fraîche et cognac.
- Servir le tournedos nappé de sauce, avec des pommes de terre sautées.
- Éviter de se pencher en avant après le repas.`,
      author: { connect: { id: johnDoe.id } },
      category: { connect: { id: platCat.id } },
      movie: { connect: { id: chocoMovie.id } },
      ingredients: {
        create: [
          { unit: 'unité', quantity: 1, ingredient: { connect: { name: 'Steak haché' } } },
          { unit: 'cl', quantity: 20, ingredient: { connect: { name: 'Crème fraîche' } } },
        ],
      },
    },
  });

  // 10
  await prisma.recipe.create({
    data: {
      title: 'Tarte aux pommes enchantée',
      duration: 45,
      difficulty: 2,
      image: 'http://localhost:3001/images-recettes/Tarte_pommes.webp',
      quote: 'Retour en enfance assuré !',
      isValidated: true,
      description: `La tarte d’enfance à la fois simple et magique.
Instructions :
- Étalez une pâte, garnissez de pommes émincées et de sucre.
- Cuire 35 min à 180°C, servir tiède.`,
      author: { connect: { id: janeSmith.id } },
      category: { connect: { id: dessertCat.id } },
      movie: { connect: { id: chihiroMovie.id } },
      ingredients: {
        create: [
          { unit: 'pièce', quantity: 3, ingredient: { connect: { name: 'Pomme' } } },
          { unit: 'g', quantity: 20, ingredient: { connect: { name: 'Sucre' } } },
        ],
      },
    },
  });

<<<<<<< HEAD
  // Bièraubeurre de Harry Potter
  let recipe3 = await prisma.recipe.findFirst({ where: { title: 'Bièraubeurre' } });
  if (!recipe3) {
    recipe3 = await prisma.recipe.create({
      data: {
        title: 'Bièraubeurre',
        description: `1. Dans une casserole, faites fondre le beurre avec le sucre.
2. Ajoutez le lait chaud progressivement en fouettant.
3. Laissez mijoter à feu doux 10 minutes en remuant.
4. Ajoutez une pincée de cannelle si désiré.
5. Servez chaud avec une touche de crème fouettée.`,
        duration: 30,
        difficulty: 2,
        image: 'http://localhost:3001/images-recettes/biereaubeurre.webp',
        quote: 'Oh, c\'est la meilleure chose que j\'ai jamais bue! - Harry Potter lors de sa première visite aux Trois Balais',
        
        userId: adminUser.id,
        categoryId: categories.find((c: Category) => c.name === 'Boissons')?.id || mainDishCategory.id,
        movieId: harryPotterMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 200, unit: 'ml', ingredientId: milk.id },
            { quantity: 50, unit: 'g', ingredientId: butter.id },
            { quantity: 100, unit: 'g', ingredientId: sugar.id },
          ],
        },
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Bièraubeurre créée.');

  // Chocolats de Vianne
  let recipe4 = await prisma.recipe.findFirst({ where: { title: 'Chocolats chauds épicés à la Vianne' } });
  if (!recipe4) {
    recipe4 = await prisma.recipe.create({
      data: {
        title: 'Chocolats chauds épicés à la Vianne',
        description: `1. Faites chauffer le lait à feu doux sans le faire bouillir.
2. Cassez le chocolat en petits morceaux.
3. Ajoutez le chocolat dans le lait chaud et remuez jusqu'à ce qu'il soit fondu.
4. Ajoutez une pincée de piment de Cayenne.
5. Fouettez jusqu'à obtenir une texture mousseuse.
6. Servez chaud avec une pincée de cacao en poudre.`,
        duration: 20,
        difficulty: 3,
        image: 'http://localhost:3001/images-recettes/chocolat_chaud.webp',
        quote: 'Le chocolat possède des vertus magiques qui peuvent transformer une journée ordinaire en moment extraordinaire.',
        isValidated: true,
        
        userId: adminUser.id,
        categoryId: dessertCategory.id,
        movieId: chocolatMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 200, unit: 'g', ingredientId: chocolate.id },
            { quantity: 500, unit: 'ml', ingredientId: milk.id },
            { quantity: 1, unit: 'pincée', ingredientId: chili.id },
          ],
        },
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Chocolats épicés créée.');

  // Bœuf Bourguignon de Julia Child
  let recipe5 = await prisma.recipe.findFirst({ where: { title: 'Bœuf Bourguignon de Julia' } });
  if (!recipe5) {
    recipe5 = await prisma.recipe.create({
      data: {
        title: 'Bœuf Bourguignon de Julia',
        description: `1. Coupez la viande en cubes et faites-la mariner dans le vin rouge.
2. Faites revenir les lardons et réservez-les.
3. Dans la même cocotte, faites dorer la viande de tous les côtés.
4. Ajoutez les oignons, l'ail et les carottes.
5. Remettez les lardons, ajoutez le vin et le bouillon.
6. Laissez mijoter 2h30 à feu doux.
7. Ajoutez les champignons 30 minutes avant la fin.
8. Servez chaud avec des pommes de terre.`,
        duration: 180,
        difficulty: 4,
        image: 'http://localhost:3001/images-recettes/boeuf_bourguignon.webp',
        quote: 'En cuisine, il n\'y a pas d\'erreurs, seulement des accidents créatifs!',
        isValidated: true,
        
        userId: regularUser.id,
        categoryId: mainDishCategory.id,
        movieId: julieJuliaMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 1, unit: 'kg', ingredientId: mincedMeat.id },
            { quantity: 2, unit: 'unités', ingredientId: onion.id },
            { quantity: 4, unit: 'gousses', ingredientId: garlic.id },
            { quantity: 30, unit: 'ml', ingredientId: oliveOil.id },
          ],
        },
      },
      include: { author: true, category: true, movie: true, ingredients: { include: { ingredient: true } } },
    });
  }
  console.log('Recette de Bœuf Bourguignon créée.');

  // Caille en Sarcophage du Festin de Babette
  const festinMovie = movies.find((m: Movie) => m.title.includes('Festin de Babette'));
  let recipe6 = await prisma.recipe.findFirst({ where: { title: 'Caille en Sarcophage' } });
  if (!recipe6) {
    recipe6 = await prisma.recipe.create({
      data: {
        title: 'Caille en Sarcophage',
        description: `1. Préparez la pâte feuilletée et laissez-la reposer.
2. Désossez délicatement les cailles.
3. Préparez la farce aux truffes et aux foies gras.
4. Farcissez les cailles et enveloppez-les dans la pâte.
5. Dorez à l'œuf et faites des motifs décoratifs.
6. Cuisez au four 25 minutes à 200°C.
7. Préparez la sauce aux truffes pendant la cuisson.
8. Servez immédiatement avec la sauce.`,
        duration: 150,
        difficulty: 5,
        image: 'http://localhost:3001/images-recettes/caille-sarcophage.webp',
        quote: 'La cuisine est un acte d\'amour.',
        isValidated: true,
        
        userId: adminUser.id,
        categoryId: mainDishCategory.id,
        movieId: festinMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 200, unit: 'g', ingredientId: flour.id },
            { quantity: 150, unit: 'g', ingredientId: butter.id },
            { quantity: 100, unit: 'ml', ingredientId: cream.id },
            { quantity: 2, unit: 'brins', ingredientId: thyme.id },
          ],
        },
      },
    });
  }
  console.log('Recette de Caille en Sarcophage créée.');

  // Saumon en Croûte d'Herbes de Comme un Chef
  const commeUnChefMovie = movies.find((m: Movie) => m.title.includes('Comme un Chef'));
  let recipe7 = await prisma.recipe.findFirst({ where: { title: 'Saumon en Croûte d\'Herbes' } });
  if (!recipe7) {
    recipe7 = await prisma.recipe.create({
      data: {
        title: 'Saumon en Croûte d\'Herbes',
        description: `1. Hachez finement les herbes avec l'ail et le zeste de citron.
2. Mélangez avec la chapelure et l'huile d'olive.
3. Assaisonnez les filets de saumon.
4. Recouvrez de la croûte d'herbes.
5. Cuisez au four 15-20 minutes à 180°C.
6. Préparez la sauce au citron pendant la cuisson.
7. Servez avec des légumes de saison.`,
        duration: 45,
        difficulty: 3,
        image: 'http://localhost:3001/images-recettes/Saumon_en_croute.webp',
        quote: 'La cuisine, c\'est comme la musique, il faut trouver la bonne harmonie.',
        isValidated: true,
        
        userId: regularUser.id,
        categoryId: mainDishCategory.id,
        movieId: commeUnChefMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 200, unit: 'g', ingredientId: salmon.id },
            { quantity: 1, unit: 'unité', ingredientId: lemon.id },
            { quantity: 2, unit: 'brins', ingredientId: rosemary.id },
            { quantity: 2, unit: 'brins', ingredientId: thyme.id },
            { quantity: 30, unit: 'ml', ingredientId: oliveOil.id },
          ],
        },
      },
    });
  }
  console.log('Recette de Saumon en Croûte d\'Herbes créée.');

  // Poulet aux Morilles des Saveurs du Palais
  const saveursMovie = movies.find((m: Movie) => m.title.includes('Saveurs du Palais'));
  let recipe8 = await prisma.recipe.findFirst({ where: { title: 'Poulet aux Morilles à la Crème' } });
  if (!recipe8) {
    recipe8 = await prisma.recipe.create({
      data: {
        title: 'Poulet aux Morilles à la Crème',
        description: `1. Réhydratez les morilles séchées.
2. Faites revenir le poulet jusqu'à ce qu'il soit doré.
3. Ajoutez les échalotes et l'ail émincés.
4. Déglacez au vin blanc.
5. Ajoutez les morilles et la crème.
6. Laissez mijoter 30 minutes.
7. Rectifiez l'assaisonnement.
8. Servez avec du riz ou des tagliatelles.`,
        duration: 60,
        difficulty: 4,
        image: 'http://localhost:3001/images-recettes/poulet-aux-morilles.webp',
        quote: 'La cuisine présidentielle doit être à l\'image de la France : excellente.',
        isValidated: true,
        
        userId: adminUser.id,
        categoryId: mainDishCategory.id,
        movieId: saveursMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 200, unit: 'ml', ingredientId: cream.id },
            { quantity: 100, unit: 'g', ingredientId: mushrooms.id },
            { quantity: 2, unit: 'gousses', ingredientId: garlic.id },
            { quantity: 1, unit: 'unité', ingredientId: onion.id },
            { quantity: 30, unit: 'g', ingredientId: butter.id },
          ],
        },
      },
    });
  }
  console.log('Recette de Poulet aux Morilles créée.');

  // Tarte aux Pommes de Rémy
  let recipe9 = await prisma.recipe.findFirst({ where: { title: 'Tarte aux Pommes à la Rémy' } });
  if (!recipe9) {
    recipe9 = await prisma.recipe.create({
      data: {
        title: 'Tarte aux Pommes à la Rémy',
        description: `1. Préparez la pâte et laissez-la reposer 1h.
2. Épluchez et découpez finement les pommes.
3. Étalez la pâte dans le moule.
4. Disposez artistiquement les pommes.
5. Saupoudrez de sucre et de cannelle.
6. Ajoutez quelques noisettes de beurre.
7. Cuisez 40 minutes à 180°C.
8. Glacez avec du miel chaud.`,
        duration: 75,
        difficulty: 3,
        image: 'http://localhost:3001/images-recettes/Tarte_pommes.webp',
        quote: 'N\'importe qui peut cuisiner, mais seuls les téméraires peuvent exceller.',
        isValidated: true,
        
        userId: regularUser.id,
        categoryId: dessertCategory.id,
        movieId: ratatouilleMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 250, unit: 'g', ingredientId: flour.id },
            { quantity: 125, unit: 'g', ingredientId: butter.id },
            { quantity: 4, unit: 'unités', ingredientId: apple.id },
            { quantity: 100, unit: 'g', ingredientId: sugar.id },
            { quantity: 1, unit: 'pincée', ingredientId: cinnamon.id },
          ],
        },
      },
    });
  }
  console.log('Recette de Tarte aux Pommes créée.');

  // Velouté de Potiron de Harry Potter
  let recipe10 = await prisma.recipe.findFirst({ where: { title: 'Velouté de Potiron de Poudlard' } });
  if (!recipe10) {
    recipe10 = await prisma.recipe.create({
      data: {
        title: 'Velouté de Potiron de Poudlard',
        description: `1. Épluchez et coupez le potiron en cubes.
2. Faites revenir l'oignon émincé.
3. Ajoutez le potiron et le bouillon.
4. Laissez mijoter 20 minutes.
5. Mixez jusqu'à obtenir un velouté.
6. Ajoutez la crème et la muscade.
7. Réchauffez doucement.
8. Servez avec des croûtons dorés.`,
        duration: 45,
        difficulty: 2,
        image: 'http://localhost:3001/images-recettes/velouté_potiron.webp',
        quote: 'Un festin digne de Poudlard!',
        isValidated: true,
        
        userId: adminUser.id,
        categoryId: categories.find((c: Category) => c.name === 'Entrées')?.id || mainDishCategory.id,
        movieId: harryPotterMovie?.id,
        
        ingredients: {
          create: [
            { quantity: 500, unit: 'g', ingredientId: pumpkin.id },
            { quantity: 200, unit: 'ml', ingredientId: cream.id },
            { quantity: 1, unit: 'unité', ingredientId: onion.id },
            { quantity: 500, unit: 'ml', ingredientId: bouillon.id },
            { quantity: 1, unit: 'pincée', ingredientId: nutmeg.id },
          ],
        },
      },
    });
  }
  console.log('Recette de Velouté de Potiron créée.');

  console.log('Seeding terminé.');
=======
  console.log('Seeding terminé avec succès !');
>>>>>>> 00c42826bb691a94be518b0a17ebae59416becca
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });