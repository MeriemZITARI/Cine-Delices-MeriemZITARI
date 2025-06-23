import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../../services/api/RecipeService';

import type { IRecipe } from '../../types/Recipe';
import type { IMovie } from '../../types/Movies';
import RecipeImage from '../RecipeImage';
import MoviePoster from '../MoviePoster';
import RecipeCarouselNew from '../RecipeCarousselNew';
import './HomePage.css';
import SearchForm from '../SearchForm/SearchForm';
import { FaClock, FaTools } from 'react-icons/fa';
import getDifficultyText from '../../utils/getDifficulty';

// Composant principal de la page d'accueil
const HomePage: React.FC = () => {
  // Ref pour la section résultats de recherche
  const resultsRef = React.useRef<HTMLDivElement>(null);
  // --- États principaux ---
  // Recette du jour (affichage en haut)
  const [featuredRecipe, setFeaturedRecipe] = useState<IRecipe | null>(null);
  // Dernières recettes pour le carrousel (toujours affichées)
  const [latestRecipes, setLatestRecipes] = useState<IRecipe[]>([]);
  // Résultats de la recherche utilisateur
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  // Indique si l'utilisateur a lancé une recherche (pour afficher la section résultats)
  const [hasSearched, setHasSearched] = useState(false);
  // Film aléatoire à afficher à côté du carrousel
  const [randomMovieForCarrousel, setRandomMovieForCarrousel] = useState<IMovie | null>(null);
  // Indique si les données sont en cours de chargement (affiche un loader)
  const [loading, setLoading] = useState(true);

  // --- États pour le formulaire de recherche ---
  // Terme recherché (texte)
  const [searchTerm, setSearchTerm] = useState('');
  // Durée sélectionnée (minutes)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null); // Stocke la durée sélectionnée
  // Type/catégorie sélectionné (clé interne : 'entrée', 'plat', ...)
  const [selectedType, setSelectedType] = useState<string | null>(null); // Stocke le type/catégorie sélectionné

  // --- Chargement initial des données (recettes, films) ---
  useEffect(() => { // Récupère toutes les recettes et prépare les données pour l'affichage principal
    const fetchData = async () => {
      try {
        setLoading(true);
        const recipesResponse = await recipeService.getRecipes();
        if (recipesResponse?.data && recipesResponse.data.length > 0) {
          // Sélection aléatoire d'une recette pour la recette du jour
          const shuffledRecipes = [...recipesResponse.data].sort(() => Math.random() - 0.5);
          setFeaturedRecipe(shuffledRecipes[0]); // La première recette aléatoire
          setLatestRecipes(shuffledRecipes.slice(1, 4)); // Les 3 recettes suivantes
          // Extraire les films uniques à partir des recettes
          const moviesMap: { [id: string]: IMovie } = {};
          recipesResponse.data.forEach((r: IRecipe) => {
            if (r.movie && r.movie.id && !moviesMap[r.movie.id]) {
              moviesMap[r.movie.id] = {
                id: r.movie.id,
                title: r.movie.title,
                description: '',
                moviedbId: r.movie.moviedbId,
                imdbLink: (r.movie as any).imdbLink || '',
                releaseDate: r.movie.releaseDate,
                createdAt: '',
                updatedAt: ''
              };
            }
          });
          const moviesArr = Object.values(moviesMap);

          if (moviesArr.length > 0) {
            const randomMovie = moviesArr[Math.floor(Math.random() * moviesArr.length)];
            setRandomMovieForCarrousel(randomMovie);
          } else {
            setRandomMovieForCarrousel(null);
          }
        } else {
          setFeaturedRecipe(null);
          setLatestRecipes([]);
          setRandomMovieForCarrousel(null);
        }
      } catch (error) {
        setFeaturedRecipe(null);
        setLatestRecipes([]);
        setRandomMovieForCarrousel(null);
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Scroll automatique vers la section résultats après la recherche
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200); // Légère attente pour laisser le DOM se mettre à jour

    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await recipeService.getRecipes();
      let filteredRecipes = response.data;
      console.log("Recettes à filtrer:", filteredRecipes);

      // --- Filtrage sur la durée ---
      if (selectedDuration) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.duration <= selectedDuration
        );
      }

      // --- Filtrage direct sur la catégorie sélectionnée ---
      if (selectedType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.category && recipe.category.name === selectedType
        );
      }

      // --- Filtrage sur le titre ou les ingrédients de la recette ---
      if (searchTerm) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.ingredients && recipe.ingredients.some(ing =>
            ing.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );
      }

      console.log("Recettes filtrées:", filteredRecipes);
      setSearchResults(filteredRecipes);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialise les résultats si tous les filtres sont vides (pour éviter d'afficher de vieux résultats)
  React.useEffect(() => {
    if (!searchTerm && !selectedDuration && !selectedType) {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchTerm, selectedDuration, selectedType]);


  // Affiche un loader pendant le chargement initial
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-0 rounded-lg overflow-hidden shadow-md">
            {/* Recette du jour - Plus grande sur desktop */}
            {featuredRecipe && (
              <Link
                to={`/recettes/${featuredRecipe.id}`}
                className="group order-2 lg:order-1 lg:flex-1 relative overflow-hidden shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent text-white px-4 py-2">
                  <h2 className="text-2xl lg:text-4xl font-bold group-hover:text-customYellow">La recette du jour !</h2>
                </div>
                <RecipeImage
                  recipe={featuredRecipe}
                  alt={featuredRecipe.title}
                  className="w-full h-48 lg:h-[400px] object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                  <h1 className="text-lg lg:text-2xl font-bold mb-2 drop-shadow-md group-hover:text-customYellow">
                    {featuredRecipe.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 group-hover:text-customYellow">
                      <span className="text-customYellow">
                        <FaClock />
                      </span>
                      {featuredRecipe.duration} min
                    </span>
                    <span className="flex items-center gap-2 group-hover:text-customYellow">
                      <span className="text-customYellow">
                        <FaTools />
                      </span>
                      {getDifficultyText(featuredRecipe.difficulty)}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Formulaire de recherche */}
            <div className="order-1 hidden lg:block lg:order-2 lg:w-[380px] mb-6 lg:mb-0">
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
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* --- Section films et carrousel (toujours visible, non filtrée) --- */}
        <section className="mb-16 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Films et Recettes à l'affiche</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Affiche de film aléatoire à gauche du carrousel (desktop uniquement) */}
            <div className="hidden lg:block w-full lg:w-[30%]">
              {randomMovieForCarrousel && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col items-center justify-center">
                  <div className="relative h-[320px] w-full flex items-center justify-center">
                    <MoviePoster
                      movie={randomMovieForCarrousel}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-2">{randomMovieForCarrousel.title}</h3>
                    <p className="text-gray-500 text-sm">{new Date(randomMovieForCarrousel.releaseDate).getFullYear()}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Carrousel desktop uniquement (70%) */}
            <div className="hidden lg:block w-full lg:w-[70%]">
              {Array.isArray(latestRecipes) && latestRecipes.length > 0 ? (
                <RecipeCarouselNew recipes={latestRecipes} />
              ) : (
                <p className="text-gray-500 text-center">Aucune recette à afficher pour le moment.</p>
              )}
            </div>
          </div>
        </section>

        {/* --- Résultats de recherche (desktop uniquement, affichés seulement après une recherche) --- */}
        {hasSearched && (
          <section ref={resultsRef} className="mb-16 hidden md:block">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Résultats de la recherche</h2>
            {searchResults.length === 0 ? (
              <p className="text-gray-500 text-center">Aucun résultat trouvé.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((recipe) => (
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
                ))}
              </div>
            )}
          </section>
        )}

        
        {/* Dernières recettes - Mobile uniquement */}
        <section className="block lg:hidden mb-16">
          <h2 className="text-2xl font-bold mb-6">Les dernières recettes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestRecipes.slice(0, 6).map((recipe) => (
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
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/recettes"
              className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-medium group"
            >
              Explorer toutes les recettes 
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* Liens sociaux */}
        {/* Footer sans liens sociaux */}
        <footer className="mt-16 py-8 border-t">
          {/* Footer épuré, liens sociaux retirés */}
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
