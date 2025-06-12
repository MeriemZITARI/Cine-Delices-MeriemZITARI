import React, { useEffect, useState } from 'react';
import { recipeService } from '../services/api/RecipeService';
import type { IRecipe } from '../types/Recipe';
import RecipeImage from './RecipeImage';
import MoviePoster from './MoviePoster';
import imdbData from '../assets/imdb.json';
import placeholderImg from "/images/placeholder.jpg?url";

const getImdbLink = (movieTitle: string): string | undefined => {
  const found = imdbData.find((m: { titre: string; imdb: string }) => m.titre === movieTitle);
  return found?.imdb;
};

const TestApi: React.FC = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await recipeService.getRecipes();
        if (response?.data) {
          setRecipes(response.data);
        } else {
          throw new Error('Erreur lors de la récupération des recettes');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des recettes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Recettes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src={recipe.image || placeholderImg} 
                alt={recipe.title} 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-2 bg-gray-100 text-sm">
              <a href={recipe.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">
                {recipe.image || "Image par défaut"}
              </a>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">{recipe.title}</h3>
              <p className="text-gray-600 mb-3">{recipe.description}</p>
              {recipe.movie && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Film associé:</h4>
                  <div className="flex items-center mt-1">
                    <div className="relative w-24 h-36 mr-2">
                      <MoviePoster
                        imdbLink={getImdbLink(recipe.movie.title)}
                        alt={recipe.movie.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 break-all mb-1">
                        {getImdbLink(recipe.movie.title) ? (
                          <a href={getImdbLink(recipe.movie.title)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {getImdbLink(recipe.movie.title)}
                          </a>
                        ) : (
                          <span>IMDb non disponible</span>
                        )}
                      </div>
                      <p>{recipe.movie.title}</p>
                      <p className="text-sm text-gray-500">{recipe.movie.releaseDate}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <h4 className="font-semibold text-gray-700">Ingrédients:</h4>
                <ul className="list-disc list-inside">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-600">
                      {ing.quantity} {ing.unit} {ing.ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Instructions:</h4>
                  <ol className="list-decimal list-inside">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="mt-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ {recipe.preparationTime} min</span>
                  <span>🔥 Difficulté: {recipe.difficulty}/5</span>
                  <span>👥 {recipe.servings} portion(s)</span>
                </div>
              </div>
              {recipe.author && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Par {recipe.author.firstName} {recipe.author.lastName || recipe.author.username}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestApi;