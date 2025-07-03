import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClock } from 'react-icons/fa';

import { useRecipeById } from "../hooks/query/recipe";
import { useMovieById } from "../hooks/query/movie";

import type { IMovie } from "../types/Movies";
//import type { Ingredient } from "../types/Recipe";

import RecipeDetail from "./RecipeDetail";
import getDifficultyText from '../utils/getDifficulty';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //  Récupération des données de recette via TanStack Query
  const { data: recipe, isLoading, isError } = useRecipeById(id ?? '');

  //  Si la recette contient un film, on le récupère aussi (lazy loading)
  const { data: movie } = useMovieById(recipe?.movie?.id ?? '');

  //  Chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  //  Erreur ou recette absente
  if (isError || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-4">Impossible de charger la recette.</p>
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

  //  Formatage des ingrédients
  const formattedIngredients =
    recipe.ingredients && Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((ingredient) => `${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredient.name}`)
      : [];

  //  Instructions
  const instructions = recipe.description || "Aucune instruction disponible";

  //  Auteur
  const authorName = recipe.author
    ? `${recipe.author.firstName || ""} ${recipe.author.lastName || recipe.author.username}`.trim()
    : "Auteur inconnu";

  return (
    <RecipeDetail
      title={recipe.title}
      author={authorName}
      difficulty={getDifficultyText(recipe.difficulty)}
      duration={recipe.duration || 0}
      image={recipe.image || "/images/placeholder.jpg"}
      category={recipe.category?.name || "Non catégorisé"}
      movie={movie as IMovie}
      ingredients={formattedIngredients}
      instructions={instructions}
      anecdote={recipe.anecdote || "Pas d'anecdote disponible pour cette recette."}
    />
  );
};

export default RecipeDetailPage;
