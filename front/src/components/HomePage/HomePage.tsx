/**
 * HomePage.tsx
 * Page d'accueil de l'application optimisée en mobile-first
 * qui s'adapte progressivement au desktop
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IRecipe } from "../../types/Recipe";
import recipeService from "../../services/api/RecipeService";
import RecipeImage from "../RecipeImage";
import MovieImage from "../MovieImage";
import { useSearchModal } from "../../context/SearchModalContext";
import SearchForm from "../SearchForm/SearchForm";
import { cn } from "../../lib/utils";

interface LoadingState {
  recipes: boolean;
  featured: boolean;
  categories: boolean;
}

const HomePage: React.FC = () => {
  // États pour les données
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<IRecipe | null>(null);
  const [latestRecipes, setLatestRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    recipes: true,
    featured: true,
    categories: true,
  });
  const [error, setError] = useState<string | null>(null);

  // État pour la recherche
  const { isSearchVisible } = useSearchModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération de toutes les recettes
        const recipesResponse = await recipeService.getRecipes();
        console.log('Response from API:', recipesResponse); // Pour le débogage
        if (recipesResponse && recipesResponse.success && Array.isArray(recipesResponse.data)) {
          const allRecipes = recipesResponse.data;
          setRecipes(allRecipes);
          
          // Sélectionner la recette mise en avant (première recette)
          if (allRecipes.length > 0) {
            setFeaturedRecipe(allRecipes[0]);
          }
          
          // Sélectionner les 3 dernières recettes pour le carrousel
          setLatestRecipes(allRecipes.slice(-3));
          
          setLoading((prev: LoadingState) => ({
            ...prev,
            recipes: false,
            featured: false
          }));
        }
        
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Une erreur est survenue lors du chargement des données.");
        setLoading({
          recipes: false,
          featured: false,
          categories: false
        });
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await recipeService.searchRecipes(term);
      if (response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading.recipes || loading.featured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Section Hero avec la recette mise en avant */}
      <section className="bg-gradient-to-b from-red-50 to-white py-8">
        <div className="container mx-auto px-4">
          {featuredRecipe && (
            <Link to={`/recettes/${featuredRecipe.id}`}>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <RecipeImage
                  recipe={{
                    id: featuredRecipe.id,
                    title: featuredRecipe.title,
                    image: featuredRecipe.image
                  }}
                  alt={featuredRecipe.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h1 className="text-white text-3xl font-bold mb-2">
                    {featuredRecipe.title}
                  </h1>
                  <p className="text-white text-lg">
                    ⏱️ {featuredRecipe.preparationTime} minutes
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Section des dernières recettes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Dernières recettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRecipes.map((recipe: IRecipe) => (
              <Link
                key={recipe.id}
                to={`/recettes/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <RecipeImage
                  recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image
                  }}
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
      </section>

      {/* Section de recherche */}
      {isSearchVisible && (
        <SearchForm />
      )}
    </div>
  );
};

export default HomePage;
