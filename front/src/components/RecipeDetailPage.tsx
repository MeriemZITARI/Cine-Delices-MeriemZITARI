import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeDetail from "./RecipeDetail";
import { recipeService } from "../services/api";
import { Recipe } from "../types";

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const response = await recipeService.getRecipeById(id);
          setRecipe(response.data ?? null);
        }
      } catch (error) {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (!recipe) return <div className="text-center py-10">Recette introuvable</div>;

  // Gestion des champs additionnels potentiels (anecdote, author)
  // @ts-ignore
  const anecdote = recipe.anecdote || "";
  // @ts-ignore
  const author = recipe.author || "Auteur inconnu";

  // Conversion instructions (array ou string)
  let instructions = "";
  if (Array.isArray(recipe.instructions)) {
    instructions = recipe.instructions.join("\n");
  } else if (typeof recipe.instructions === "string") {
    instructions = recipe.instructions;
  }

  return (
    <RecipeDetail
      title={recipe.title}
      author={author}
      difficulty={recipe.difficulty || "-"}
      duration={recipe.duration || 0}
      image={recipe.image || "/images/placeholder.jpg"}
      category={recipe.category?.name || "Plat"}
      movie={recipe.movie}
      ingredients={recipe.ingredients || []}
      instructions={instructions}
      anecdote={anecdote}
    />
  );
};

export default RecipeDetailPage;
