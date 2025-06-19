import { prisma } from '../client/prismaClient';
import type { Prisma } from '../../generated/prisma';
import type{FilterMoviesInput }   from '../validations/movie';



// --- READ (tous les films) ---
export async function getAllMoviesService(options: FilterMoviesInput = {}) {
    const { search, year, sortBy, sortOrder } = options;
  
    // 1. On prépare un objet de filtres vide.
    const whereClause: Prisma.MovieWhereInput = {};
  
    // 2. On remplit les filtres, condition par condition.
    // chaque bloc "if" fait une seule chose.
    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive',
      };
    }
  
    if (year) {
      whereClause.releaseDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }
  
    
    // On utilise Prisma.MovieOrderByWithRelationInput pour définir comment trier les films.
    // On utilise 'desc' par défaut pour trier par date de sortie la plus récente
    // On définit d'abord notre tri par défaut.
    let orderByClause: Prisma.MovieOrderByWithRelationInput = {
      releaseDate: 'desc',
    };
  
    // Si l'utilisateur demande un tri spécifique, ALORS on remplace le tri par défaut.
    if (sortBy) {
      orderByClause = {
        [sortBy]: sortOrder || 'desc',
      };
    }
  
    // 4. On exécute la requête finale avec nos objets construits.
    const movies = await prisma.movie.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        recipes: {
          select: { id: true, title: true, image: true },
        },
        
      },
    });
  
    return movies;
  }

// --- READ (un seul film par son ID, avec ses recettes) ---
export async function getMovieByIdService(id: string) {
    // findUniqueOrThrow lève une erreur automatiquement si le film n'est pas trouvé
    return await prisma.movie.findUniqueOrThrow({
      where: { id },
  
      
      include: {
        // On demande d'inclure la relation 'recipes'
        recipes: {
          // Pour une page de détail, on veut souvent des informations riches.
          // On peut donc aussi inclure des détails pour chaque recette de la liste !
          include: {
            category: true, // Inclure la catégorie de chaque recette
            author: {       // Inclure l'auteur de chaque recette
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
      
    });
  }
