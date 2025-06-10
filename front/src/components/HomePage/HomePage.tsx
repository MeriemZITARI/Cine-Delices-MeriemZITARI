/**
 * HomePage.tsx
 * Page d'accueil de l'application optimisée en mobile-first
 * qui s'adapte progressivement au desktop
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
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
// Types et utilitaires
import { Recipe, Category, Movie, SearchFilters } from '../../types';
import { cn } from "../../lib/utils";
// Styles spécifiques pour cette page
import './HomePage.css';

/**
 * Composant SearchForm - Mobile-first
 * Formulaire de recherche avec filtres de durée et de type
 */
const SearchForm: React.FC = () => {
  // États pour les différents critères de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="recettes de pizza" 
            className="w-full p-2 pl-10 sm:p-3 sm:pl-10 border rounded-md text-sm sm:text-base mb-4 sm:mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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

/**
 * Composant de la page d'accueil mobile-first
 */
const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSearchVisible } = useSearchModal();
  
  // Fonction pour gérer la navigation vers la page d'un film
  const handleMovieClick = (e: React.MouseEvent<HTMLDivElement>, movieId: number) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/films/${movieId}`;
  };
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
      }      
      
      // Filtrer par type de plat si sélectionné
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
      {/* Section Top - Recherche et Recette du jour avec bandeau jaune */}      
      <div className="background-gradient-yellow py-8 sm:py-10">
        <div className="container mx-auto px-4">
          {/* Formulaire de recherche mobile */}
          {isSearchVisible && (
            <div className="lg:hidden w-full mb-6 search-container">
              <div className="bg-white rounded-lg sm:rounded-none shadow-lg p-4">
                <SearchForm />
              </div>
            </div>
          )}

          {/* Layout flexible qui change de direction en fonction de la taille d'écran */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 desktop-layout">
            {/* Recette du jour - Pleine largeur sur mobile, 4/5 sur desktop */}
            <div className="w-full lg:w-4/5 bg-black rounded-lg sm:rounded-none overflow-hidden shadow-lg mb-6 lg:mb-0 h-[300px] sm:h-[400px] lg:h-[500px] featured-recipe">
              {featuredRecipe && (
                <Link to={`/recettes/${featuredRecipe.id}`} className="block h-full cursor-pointer">
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
                </Link>
              )}
            </div>

            {/* Formulaire de recherche desktop - Caché sur mobile, visible sur desktop */}            
            <div className="hidden lg:block w-1/5 bg-white rounded-none shadow-lg p-4 sm:p-6 search-sidebar">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>      {/* Section Film à l'affiche et Dernières recettes */}
      <div className="bg-white mt-6 sm:mt-10">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Layout flexible qui change selon la taille d'écran */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 sm:mb-12 desktop-layout">            
            {/* Film à l'affiche - Pleine largeur sur mobile, 1/5 sur desktop */}
            <div className="w-full lg:w-1/5 desktop-layout-sidebar">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <span className="mr-2">🎬</span>
                Le film à l'affiche
              </h2>
              {featuredMovie && (
                <div className="flex justify-center lg:justify-start">
                  <div className="w-full max-w-[220px]">
                    <Link to={`/films/${featuredMovie.id}`} className="block cursor-pointer">
                      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <MovieImage 
                          movie={featuredMovie} 
                          alt={featuredMovie.title} 
                          className="w-full h-[320px] object-cover object-center"
                        />
                        <div className="p-2 bg-gray-50">
                          <p className="text-sm font-medium">{featuredMovie.title}</p>
                          <p className="text-xs text-gray-500">{featuredMovie.year}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Section dernières recettes - Pleine largeur sur mobile, 4/5 sur desktop */}
            <div className="w-full lg:w-4/5 desktop-layout-main">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <span className="mr-2">🍽️</span>
                Les dernières recettes
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  <p className="mt-2 text-gray-500">Chargement des recettes...</p>
                </div>
              ) : (
                <div className="relative">                    {/* Version mobile - Cards avec alternance 70/30 */}
                  <div className="lg:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {latestRecipes.map((recipe, index) => (
                        <div key={recipe.id} className="recipe-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden">
                          <Link to={`/recettes/${recipe.id}`}>
                            <div className="h-48 flex overflow-hidden">
                              {index % 2 === 0 ? (
                                /* Configuration 70% recette, 30% film */
                                <>                                  <div className="w-[70%] h-full overflow-hidden relative">                                    <RecipeImage 
                                      recipe={recipe}
                                      alt={recipe.title}
                                      className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                    <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                      Recette
                                    </div>
                                  </div>                                  <div className="w-[30%] h-full overflow-hidden relative">
                                    {recipe.movie ? (
                                      <>
                                        <div 
                                          onClick={(e) => handleMovieClick(e, recipe.movie.id)} 
                                          className="w-full h-full cursor-pointer"
                                        >
                                          <MovieImage 
                                            movie={recipe.movie}
                                            alt={recipe.movie.title}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                            Film
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-2xl">🎬</span>
                                      </div>
                                    )}
                                  </div>
                                </>                              ) : (                                /* Configuration 30% film, 70% recette */
                                <>                                  <div className="w-[30%] h-full overflow-hidden relative">
                                    {recipe.movie ? (
                                      <>
                                        <div 
                                          onClick={(e) => handleMovieClick(e, recipe.movie.id)} 
                                          className="w-full h-full cursor-pointer"
                                        >
                                          <MovieImage 
                                            movie={recipe.movie}
                                            alt={recipe.movie.title}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                            Film
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-2xl">🎬</span>
                                      </div>
                                    )}
                                  </div><div className="w-[70%] h-full overflow-hidden relative">
                                    <RecipeImage 
                                      recipe={recipe}
                                      alt={recipe.title}
                                      className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                    <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                      Recette
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-md">{recipe.title}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>⏱️ {recipe.duration} min</span>
                                <span>{recipe.category?.name || 'Plat'}</span>
                                {recipe.movie && <span>🎬 {recipe.movie.title}</span>}
                              </div>
                            </div>
                          </Link>
                        </div>
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
              )}              <div className="text-center mt-6">
                <Link to="/recettes" className="inline-flex items-center py-1 text-red-500 hover:text-red-700 text-base font-medium transition-colors duration-200 voir-toutes-link">
                  <span>Voir toutes les recettes</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Résultats de recherche - Conception mobile-first */}
      {hasSearched && (
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Résultats de la recherche
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((recipe) => (
                <Link key={recipe.id} to={`/recettes/${recipe.id}`}>
                  <div className="recipe-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden h-full">
                    <div className="h-40 overflow-hidden">
                      <RecipeImage 
                        recipe={recipe} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-md font-medium">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center justify-between">
                        <span>{recipe.category?.name || 'Plat'}</span>
                        <span>⏱️ {recipe.duration} min</span>
                      </p>
                    </div>
                  </div>
                </Link>
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

      {/* Indicateur de chargement pendant la recherche */}
      {isSearching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-2">Recherche en cours...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        <hr className="border-t-2 border-red-400 my-6 sm:my-8" />
      </div>
    </div>
  );
};

export default HomePage;
