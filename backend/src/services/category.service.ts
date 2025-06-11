import { prisma } from '../client/prismaClient';
import type { CreateCategoryInput } from '../validations/category';



export async function createCategoryService(data: CreateCategoryInput) {
  try {
    // Vérifier si une catégorie avec le même nom (insensible à la casse) existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCategory) {
      // On lève une erreur spécifique pour la gérer dans le contrôleur
      throw new Error('Une catégorie avec ce nom existe déjà.');
    
    }

    // Créer la nouvelle catégorie
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    });

    return category;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    throw error; // Relancez l'erreur pour qu'elle soit gérée par le contrôleur
  }
}
