import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTools } from 'react-icons/fa';

import { useAllRecipes } from '../hooks/query/recipe'; // ✅ Hook TanStack Query
import type { IRecipe } from '../types/Recipe';

import RecipeImage from './RecipeImage';
import SearchForm from './SearchForm/SearchForm';
import getDifficultyText from '../utils/getDifficulty';

const AllRecipesPage: React.FC = () => {
  // 🌟 États locaux pour les filtres du formulaire de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 🚀 Appel de l’API via TanStack Query
  const { data, isLoading, isError } = useAllRecipes();

  // 🧾 Extraction des vraies recettes à partir de l'objet de réponse
  const recipes: IRecipe[] = data?.data ?? [];

  // 🔍 Fonction appelée à la soumission du formulaire
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Rien à faire ici car le filtrage est fait localement via useMemo
  };

  // 🧠 Filtrage local des recettes selon les filtres actifs
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchSearch =
        !searchTerm ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDuration =
        !selectedDuration || recipe.duration <= selectedDuration;

      const matchType =
        !selectedType ||
        (recipe.category?.name &&
          recipe.category.name.toLowerCase() === selectedType.toLowerCase());

      return matchSearch && matchDuration && matchType;
    });
  }, [recipes, searchTerm, selectedDuration, selectedType]);

  // ⏳ Affichage du spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  // ❌ Gestion d'erreur simple
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Erreur lors du chargement des recettes.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🧁 En-tête avec formulaire de recherche */}
      <div className="bg-customYellow py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-4 font-broadway">
            Toutes nos recettes
          </h1>
          <div className="max-w-lg mx-auto rounded-lg overflow-hidden">
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

      {/* 🍲 Grille de recettes */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
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
              <p className="mt-2 text-gray-400">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRecipesPage;
