import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeDetail from "./RecipeDetail";
import recipeService from "../services/api/RecipeService";
import type { IRecipe } from "../types/Recipe";

interface Ingredient {
  quantity: number;
  unit: string;
  ingredient: {
    name: string;
  };
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("ID de recette manquant");
          return;
        }

        const response = await recipeService.getRecipe(id);
        if (!response) {
          setError("Recette introuvable");
          return;
        }

        setRecipe(response);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement de la recette:", err);
        setError("Impossible de charger la recette");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-4">{error || "Recette introuvable"}</p>
          <button
            onClick={() => navigate("/recettes")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retourner aux recettes
          </button>
        </div>
      </div>
    );
  }

  // Formatage des ingrédients avec vérification de type
  const formattedIngredients =
    recipe.ingredients && Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((ing: Ingredient) => `${ing.quantity} ${ing.unit} ${ing.ingredient.name}`)
      : [];

  // Formatage des instructions avec vérification
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join("\n")
    : recipe.instructions || "";

  // Formatage du nom de l'auteur avec vérification
  const authorName = recipe.author
    ? `${recipe.author.firstName || ""} ${recipe.author.lastName || recipe.author.username}`.trim()
    : "Auteur inconnu";

  return (
    <RecipeDetail
      title={recipe.title}
      author={authorName}
      difficulty={recipe.difficulty?.toString() || "1"}
      duration={recipe.preparationTime || 0}
      image={recipe.image || "/images/placeholder.jpg"}
      category={recipe.category?.name || "Non catégorisé"}
      movie={
        recipe.movie
          ? {
              id: recipe.movie.id,
              title: recipe.movie.title,
              year: recipe.movie.releaseDate?.split("-")[0] || "",
              poster: recipe.movie.image,
            }
          : undefined
      }
      ingredients={formattedIngredients}
      instructions={instructions}
      anecdote={
        recipe.anecdote || "Pas d'anecdote disponible pour cette recette."
      }
    />
  );
};

export default RecipeDetailPage;
