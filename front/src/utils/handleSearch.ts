import recipeService from '../services/api/RecipeService';
import type { IRecipe } from '../types/Recipe';

interface SearchParams {
  searchTerm?: string;
  selectedDuration?: number | null;
  selectedType?: string | null;
}

export const searchRecipes = async ({
  searchTerm,
  selectedDuration,
  selectedType,
}: SearchParams): Promise<IRecipe[]> => {
  try {
    const response = await recipeService.getRecipes();
    let filteredRecipes = response.data;

    // Filtrage sur la durée
    if (selectedDuration) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.duration <= selectedDuration
      );
    }

    // Filtrage sur la catégorie
    if (selectedType) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.category && recipe.category.name === selectedType
      );
    }

    // Filtrage sur le titre ou les ingrédients
    if (searchTerm) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.ingredients &&
            recipe.ingredients.some((ing) =>
              ing.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    return filteredRecipes;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
};