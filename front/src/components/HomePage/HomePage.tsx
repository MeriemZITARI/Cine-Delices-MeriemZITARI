/**
 * HomePage.tsx
 * Page d'accueil de l'application
 * Affiche le carrousel des recettes, le formulaire de recherche et les filtres
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Services API pour les données
import { recipeService, movieService, categoryService } from '../../services/api';
// Composants d'affichage
import RecipeImage from '../RecipeImage';
import MovieImage from '../MovieImage';
import RecipeCarousel from '../RecipeCaroussel';
import RecipeCard from '../RecipeCard';
// Contexte et composants UI
import { useSearchModal } from '../../context/SearchModalContext';
import { Button } from '../ui/button';
// Removed unused import for 'Card'
//import AdvancedSearch from './AdvancedSearch';
import { ChevronDown } from 'lucide-react';
// Types et utilitaires
import { Recipe, Category, Movie, SearchFilters } from './../../types';
import { cn } from "../../lib/utils";

/**
 * Composant SearchForm
 * Formulaire de recherche avec filtres de durée et de type
 * Permet une recherche textuelle et une sélection de filtres
 */
const SearchForm: React.FC = () => {
  // États pour les différents critères de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  /**
   * Gère la sélection/désélection d'une durée
   * @param minutes - Durée en minutes
   */
  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes === selectedDuration ? null : minutes);
  };

  /**
   * Gère la sélection/désélection d'un type
   * @param type - Type de recette
   */
  const handleTypeSelect = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche
  };

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Je cherche ..</h3>
      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
        <input 
          type="text" 
          placeholder="recettes de pizza" 
          className="w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base mb-4 sm:mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <h3 className="text-base sm:text-lg mb-2">J'ai ..</h3>
        <div className="mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3">
            {[15, 30, 45, 60].map((duration) => (
              <label key={duration} className="flex items-center text-sm sm:text-base">
                <input 
                  type="radio" 
                  name="duration" 
                  className="mr-2"
                  checked={selectedDuration === duration}
                  onChange={() => handleDurationSelect(duration)}
                />
                {duration} minutes
              </label>
            ))}
          </div>
        </div>

        <h3 className="text-base sm:text-lg mb-2">Je veux préparer</h3>
        <div className="mb-4 sm:mb-6">
          <div className="grid grid-cols-2 gap-2">
            {['entrée', 'plat', 'dessert', 'boisson'].map((type) => (
              <label key={type} className="flex items-center text-sm sm:text-base">
                <input 
                  type="radio" 
                  name="type" 
                  className="mr-2"
                  checked={selectedType === type}
                  onChange={() => handleTypeSelect(type)}
                />
                {type === 'entrée' ? 'une entrée' :
                 type === 'plat' ? 'un plat' :
                 type === 'dessert' ? 'un dessert' : 'une boisson'}
              </label>
            ))}
          </div>
        </div>
        
        <Button 
          type="submit" 
          variant="default"
          className="w-full text-sm sm:text-base"
        >
          C'est parti !
        </Button>
      </form>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSearchVisible } = useSearchModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesResponse = await recipeService.getAllRecipes();
        const categoriesResponse = await categoryService.getAllCategories();
        
        setRecipes(recipesResponse.data);
        setCategories(categoriesResponse.data);
        
        // Définir la recette mise en avant (première recette)
        if (recipesResponse.data.length > 0) {
          setFeaturedRecipe(recipesResponse.data[0]);
          // Prendre les 3 dernières recettes pour le carrousel
          setLatestRecipes(recipesResponse.data.slice(0, 3));
        }

        // Récupérer le film à l'affiche (premier film associé à une recette)
        if (recipesResponse.data.length > 0 && recipesResponse.data[0].movie) {
          setFeaturedMovie(recipesResponse.data[0].movie);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des filtres de temps
  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes === selectedDuration ? null : minutes);
  };

  // Gestion des filtres de type de plat
  const handleTypeSelect = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
  };

  // Gestion du carrousel
  const handleNextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % latestRecipes.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + latestRecipes.length) % latestRecipes.length);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      // Recherche par texte si un terme est fourni
      let results: Recipe[];
      if (searchTerm) {
        const response = await recipeService.searchRecipes(searchTerm);
        results = response.data;
      } else {
        // Sinon, récupérer toutes les recettes
        const response = await recipeService.getAllRecipes();
        results = response.data;
      }

      // Filtrer par durée si sélectionnée
      if (selectedDuration) {
        results = results.filter(recipe => recipe.duration <= selectedDuration);
      }      // Filtrer par type de plat si sélectionné
      if (selectedType) {
        results = results.filter(recipe => 
          recipe.category && recipe.category.name.toLowerCase() === selectedType.toLowerCase()
        );
      }
      
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdvancedSearch = async (params: SearchFilters) => {
    setIsSearching(true);
    try {
      const response = await recipeService.getAllRecipes();
      let results = response.data;
      
      if (params.searchTerm) {
        results = results.filter(recipe => 
          recipe.title.toLowerCase().includes(params.searchTerm!.toLowerCase()) ||
          recipe.description.toLowerCase().includes(params.searchTerm!.toLowerCase())
        );
      }
      
      if (params.category) {
        results = results.filter(recipe => recipe.category?.id === params.category);
      }
      
      if (params.minDuration) {
        results = results.filter(recipe => recipe.duration >= parseInt(params.minDuration!.toString()));
      }
      
      if (params.maxDuration) {
        results = results.filter(recipe => recipe.duration <= parseInt(params.maxDuration!.toString()));
      }
      
      if (params.difficulty) {
        results = results.filter(recipe => recipe.difficulty === params.difficulty);
      }
      
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche avancée :", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-customYellow py-4 sm:py-6">
        <div className="container mx-auto px-4">
          {/* Formulaire de recherche mobile */}
          {isSearchVisible && (
            <div className="lg:hidden w-full mb-6">
              <div className="bg-white rounded-none shadow-lg p-4">
                <SearchForm />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
            {/* Recette du jour */}
            <div className="w-full lg:w-4/5 bg-black rounded-none overflow-hidden shadow-lg mb-6 lg:mb-0 h-[300px] sm:h-[400px] lg:h-[500px]">
              {featuredRecipe && (
                <div className="relative h-full">
                  <RecipeImage 
                    recipe={featuredRecipe} 
                    alt={featuredRecipe.title} 
                    className="w-full h-full object-cover brightness-[0.35]"
                  />
                  <div className="absolute inset-0 flex flex-col p-4 sm:p-6">
                    <h2 className="text-white text-xl sm:text-2xl font-bold font-broadway drop-shadow-lg">La recette du jour !</h2>
                    <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end text-white gap-2 sm:gap-0">
                      <div className="text-sm sm:text-base font-medium drop-shadow-md">{featuredRecipe.title}</div>
                      <div className="text-xs sm:text-sm drop-shadow-md">Temps de préparation : {featuredRecipe.duration} min</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Formulaire de recherche desktop */}
            <div className="hidden lg:block w-1/5 bg-white rounded-none shadow-lg p-4 sm:p-6">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>

      {/* Section Film à l'affiche et Dernières recettes */}
      <div className="bg-white mt-8 sm:mt-12">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Film à l'affiche */}
            <div className="w-full lg:w-1/5">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Le film à l'affiche</h2>
              {featuredMovie && (
                <div className="flex justify-center lg:justify-start">
                  <div className="w-full max-w-[220px]">
                    <div className="border border-gray-200 overflow-hidden">
                      <MovieImage 
                        movie={featuredMovie} 
                        alt={featuredMovie.title} 
                        className="w-full h-[320px] object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section dernières recettes */}
            <div className="w-full lg:w-4/5">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Les dernières recettes</h2>
              {loading ? (
                <div className="text-center">Chargement...</div>
              ) : (
                <div className="relative">                  {/* Version mobile - Cards */}
                  <div className="lg:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {latestRecipes.map((recipe, index) => (
                        <RecipeCard key={recipe.id} recipe={recipe} reversed={index === 1} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Version desktop - Carousel */}
                  <div className="hidden lg:block">
                    <div className="flex items-center justify-center">
                      <div className="w-full">
                        <RecipeCarousel
                          recipes={latestRecipes}
                          activeSlide={activeSlide}
                          onPrevSlide={handlePrevSlide}
                          onNextSlide={handleNextSlide}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-6">
                <Link to="/recettes" className="underline text-blue-600">
                  Voir toutes les recettes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Résultats de recherche */}
      {hasSearched && (
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Résultats de la recherche</h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
              {searchResults.map((recipe) => (
                <div key={recipe.id} className={cn(
                  "border-[1px] bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
                )}>
                  <div>
                    <div className="h-40 overflow-hidden">
                      <RecipeImage 
                        recipe={recipe} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-md font-semibold">{recipe.title}</h3>
                      <p className="text-sm text-gray-600">
                        {recipe.category?.name} • {recipe.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-lg">
              <h3 className="text-lg sm:text-xl font-medium mb-2">Aucune recette trouvée</h3>
              <p className="text-gray-500">
                Essayez d'autres termes ou filtres pour votre recherche.
              </p>
              <Button 
                className="mt-4 bg-white hover:bg-gray-100"
                onClick={() => setHasSearched(false)}
              >
                Retour à toutes les recettes
              </Button>
            </div>
          )}
        </div>
      )}

      {isSearching && (
        <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          <p className="mt-2">Recherche en cours...</p>
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        <hr className="border-t-2 border-red-400 my-6 sm:my-8" />
      </div>
    </div>
  );
};

export default HomePage;
