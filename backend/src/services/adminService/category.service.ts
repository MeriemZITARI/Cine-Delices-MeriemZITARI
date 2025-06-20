import { prisma } from '../../client/prismaClient';
import type { CreateCategoryInput, UpdateCategoryInput } from '../../validations/admin/category';


export async function getAllCategoriesService() {
  try {
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc', // Trier les catégories par nom (ordre alphabétique)
      },
    });

    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    throw error; // Relancez l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

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
};

export async function updateCategoryService(id: string, data: UpdateCategoryInput) {
  try {
    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error('Catégorie non trouvée.');
    }

    // Mettre à jour la catégorie
    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    return updatedCategory;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error);
    throw error; // Relancez l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

export async function deleteCategoryService(categoryId: string) {
  try {
    // Vérifiez si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new Error('Catégorie non trouvée.');
    }

    // Supprimez la catégorie
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: 'Catégorie supprimée avec succès.' };
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error);
    throw error; // Relancez l'erreur pour qu'elle soit gérée par le contrôleur
  }
}