import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../services/api/RecipeService';

import type { IRecipe } from '../types/Recipe';
import RecipeImage from './RecipeImage';
import SearchForm from './SearchForm/SearchForm';
import { FaClock, FaTools } from 'react-icons/fa';
import getDifficultyText from '../utils/getDifficulty';

const AllRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const recipesResponse = await recipeService.getRecipes();
        if (recipesResponse?.data && recipesResponse.data.length > 0) {
          setRecipes(recipesResponse.data);
        } else {
          setRecipes([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des recettes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await recipeService.getRecipes();
      let filteredRecipes = response.data;

      if (selectedDuration) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.preparationTime <= selectedDuration
        );
      }

      if (selectedType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.category && recipe.category.name.toLowerCase() === selectedType.toLowerCase()
        );
      }

      if (searchTerm) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec le formulaire de recherche */}
      <div className="bg-customYellow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Toutes nos recettes</h1>
          <div className="max-w-lg mx-auto">
            <SearchForm
              onSubmit={handleSearch}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDuration={selectedDuration}
              onDurationSelect={setSelectedDuration}
              selectedType={selectedType}
              onTypeSelect={setSelectedType}
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Liste des recettes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Link 
                key={recipe.id} 
                to={`/recettes/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                <div className="relative h-48">
                  <RecipeImage
                    recipe={recipe}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {recipe.category?.name && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {recipe.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <span className="text-customYellow">
                        <FaClock />
                      </span>
                      {recipe.duration} min
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-customYellow">
                        <FaTools />
                      </span>
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Aucune recette trouvée.</p>
              <p className="mt-2 text-gray-400">Essayez de modifier vos critères de recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRecipesPage;
