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

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });