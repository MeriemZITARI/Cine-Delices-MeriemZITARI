import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IRecipe } from "../types/Recipe";
import recipeService from "../services/api/RecipeService";
import RecipeImage from "./RecipeImage";

const RecipeListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await recipeService.getRecipes();
        if (response.data) {
          setRecipes(response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des recettes:", err);
        setError("Impossible de charger les recettes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Toutes les recettes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recettes/${recipe.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <RecipeImage              recipe={recipe}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{recipe.title}</h3>
              <p className="text-sm text-gray-600">
                ⏱️ {recipe.preparationTime} minutes
              </p>
              {recipe.movie && (
                <p className="text-sm text-gray-600">
                  🎬 {recipe.movie.title}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
