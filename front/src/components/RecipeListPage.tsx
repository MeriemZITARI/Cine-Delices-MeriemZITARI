import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClock } from 'react-icons/fa'; // Ajout de l'import
import RecipeDetail from "./RecipeDetail";
import recipeService from "../services/api/RecipeService";
import MovieService from "../services/api/MovieService"; // Ajout de l'import
import type { IRecipe } from "../types/Recipe";
import type { IMovie } from "../types/Movies";
import getDifficultyText from '../utils/getDifficulty';

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

        const recipeData = await recipeService.getRecipe(id);
        
        // Ajout de plus de console.log pour déboguer
        console.log("Données brutes de la recette:", recipeData);
        console.log("Type de instructions:", typeof recipeData.instructions);
        console.log("Type de anecdote:", typeof recipeData.anecdote);
        console.log("Description:", recipeData.description);

        if (!recipeData) {
          setError("Recette introuvable");
          return;
        }

        // Si la recette a un film associé, récupérer les détails du film
        if (recipeData.movie?.id) {
          try {
            const movieData = await MovieService.getMovie(recipeData.movie.id);
            // Mettre à jour les données du film dans la recette
            recipeData.movie = {
              ...recipeData.movie,
              ...movieData,
            };
          } catch (err) {
            console.error("Erreur lors du chargement du film:", err);
          }
        }

        // Traitement des instructions et de l'anecdote
        const formattedRecipe = {
          ...recipeData,
          instructions: recipeData.description || "Aucune instruction disponible",  // Modification ici
          anecdote: recipeData.anecdote || "Pas d'anecdote disponible pour cette recette."
        };

        setRecipe(formattedRecipe);
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
  const instructions = recipe.description || "Aucune instruction disponible";  // Modification ici

  // Formatage de l'anecdote avec vérification
  const anecdote = recipe.anecdote || "Pas d'anecdote disponible pour cette recette.";

  // Ajout d'un console.log avant le rendu
  console.log("Instructions formatées:", instructions);
  console.log("Anecdote formatée:", anecdote);

  // Formatage du nom de l'auteur avec vérification
  const authorName = recipe.author
    ? `${recipe.author.firstName || ""} ${recipe.author.lastName || recipe.author.username}`.trim()
    : "Auteur inconnu";

  return (
    <RecipeDetail
      title={recipe.title}
      author={authorName}
      difficulty={getDifficultyText(recipe.difficulty)}
      duration={recipe.duration || 0} // Assurez-vous de passer duration
      image={recipe.image || "/images/placeholder.jpg"}
      category={recipe.category?.name || "Non catégorisé"}
      movie={
        recipe.movie
          ? {
              id: recipe.movie.id,
              title: recipe.movie.title,
              year: recipe.movie.releaseDate?.split("-")[0] || "",
              description: recipe.movie.description || "",
              imdbLink: recipe.movie.imdbLink || "",
              poster: recipe.movie.imageUrl,
              anecdote: recipe.movie.anecdote || ""
            }
          : undefined
      }
      ingredients={formattedIngredients}
      instructions={instructions}
      anecdote={recipe.quote || "Pas d'anecdote disponible pour cette recette."}
    />
  );
};

export default RecipeDetailPage;

