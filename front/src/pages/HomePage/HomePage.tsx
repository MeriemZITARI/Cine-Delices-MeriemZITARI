import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTools } from 'react-icons/fa';

import type { IRecipe } from '../../types/Recipe';
import type { IMovie } from '../../types/Movies';

import './HomePage.css';
import RecipeImage from '../../components/RecipeImage';
import MoviePoster from '../../components/MoviePoster';
import RecipeCarouselNew from '../../components/RecipeCarousselNew';
import SearchForm from '../../components/SearchForm/SearchForm';

import getDifficultyText from '../../utils/getDifficulty';

import { useAllRecipes, useSearchRecipes } from '../../hooks/query/recipe';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // --- Récupération de toutes les recettes ---
  const { data: response, isLoading: loadingAll } = useAllRecipes();
  const allRecipes: IRecipe[] = response?.data ?? [];

  // --- Recherche ---
  const {
    data: searchResults = [],
    isLoading: searchLoading,
    refetch: refetchSearch,
  } = useSearchRecipes({
    searchTerm,
    selectedDuration,
    selectedType,
  });
  /*
  Gère la soumission du formulaire de recherche.
  - Empêche le comportement par défaut du formulaire (rechargement de la page)
  - Marque que l'utilisateur a effectué une recherche (via `setHasSearched`)
  - Relance manuellement la recherche locale avec les critères actuels (via `refetchSearch`)
  - Attend la mise à jour des résultats, puis effectue un scroll fluide vers la section correspondante
 */
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSearched(true);
    await refetchSearch();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  useEffect(() => {
    if (!searchTerm && !selectedDuration && !selectedType) {
      setHasSearched(false);
    }
  }, [searchTerm, selectedDuration, selectedType]);

  // --- Recette à la une ---
  const featuredRecipe = allRecipes.length
    ? allRecipes[Math.floor(Math.random() * allRecipes.length)]
    : null;

  // --- Dernières recettes ---
  const latestRecipes = allRecipes.slice(0, 3);

  // --- Films uniques et aléatoire ---
  const moviesMap: Record<string, IMovie> = {};
  allRecipes.forEach((recipe) => {
    const movie = recipe.movie;
    if (movie && movie.id && !moviesMap[movie.id]) {
      moviesMap[movie.id] = {
        id: movie.id,
        title: movie.title,
        description: movie.description ?? '',
        moviedbId: movie.moviedbId,
        imdbLink: movie.imdbLink ?? '',
        releaseDate: movie.releaseDate,
        createdAt: '',
        updatedAt: '',
      };
    }
  });

  const uniqueMovies = Object.values(moviesMap);
  const randomMovie = uniqueMovies.length
    ? uniqueMovies[Math.floor(Math.random() * uniqueMovies.length)]
    : null;

  if (loadingAll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec le formulaire de recherche */}
      <header className="bg-customYellow py-8" role="region" aria-label="En-tête et recherche">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-0 rounded-lg overflow-hidden shadow-md">
            {/* Recette du jour - Plus grande sur desktop */}
            {featuredRecipe && (
              <Link
                to={`/recettes/${featuredRecipe.id}`}
                className="group order-2 lg:order-1 lg:flex-1 relative overflow-hidden shadow-lg " aria-labelledby="featured-title" // Fournit un ID pour lier au titre
              >
                
                <RecipeImage
                  recipe={featuredRecipe}
                  alt= {`Image de la recette : ${featuredRecipe.title}`} // Texte plus descriptif
                  className="w-full h-48 lg:h-[400px] object-cover"
                />
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/45">
                <div className="absolute inset-x-0 top-0 text-white px-4 py-2 ">
                  <h2 id="featured-title" className="text-2xl lg:text-4xl font-bold  group-hover:text-customYellow">
                    La recette du jour !
                  </h2>
                </div>
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
            <aside className="order-1 hidden lg:block lg:order-2 lg:w-[380px] mb-6 lg:mb-0">
              <SearchForm
                onSubmit={handleSearch}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedDuration={selectedDuration}
                onDurationSelect={setSelectedDuration}
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
              />
            </aside>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* --- Section films et carrousel (toujours visible, non filtrée) --- */}
        <section className="mb-16" role="region" aria-labelledby="section-films">
          <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Film aléatoire : visible uniquement sur md+ */}
          {randomMovie && (
            <article className="hidden md:flex flex-col md:w-full lg:w-[30%]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800" id="section-films">
          Films inspirants
            </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col items-center justify-center">
          <div className="relative h-[320px] w-full flex items-center justify-center">
            <MoviePoster
              movie={randomMovie}
              className="w-full h-full object-cover"
              alt={`Affiche du film : ${randomMovie.title}`}
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-bold text-lg mb-2">{randomMovie.title}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(randomMovie.releaseDate).getFullYear()}
            </p>
          </div>
        </div>
      </article>
    )}

    {/* Carrousel : visible sur toutes tailles */}
    <div className="w-full md:w-full lg:w-[70%]">
      <h2
        className="text-2xl font-bold mb-6 text-gray-800"
        id="section-recettes-films"
      >
        Quand le cinéma rencontre la cuisine
      </h2>

      {Array.isArray(latestRecipes) && latestRecipes.length > 0 ? (
        <RecipeCarouselNew recipes={latestRecipes} />
      ) : (
        <p className="text-gray-500 text-center">
          Aucune recette à afficher pour le moment.
        </p>
      )}
    </div>
  </div>
</section>



        {/* --- Résultats de recherche (affichés seulement après une recherche) --- */}
        {hasSearched && (
          <section ref={resultsRef} className="mb-16 block" role="region" aria-labelledby='section-results'>
            <h2 className="text-2xl font-bold mb-6 text-red-600" id="section-resultats">
              Résultats de la recherche
            </h2>
            <div aria-live="polite" className="sr-only">
              {searchResults.length === 0
                ? "Aucun résultat trouvé."
               : `${searchResults.length} recette${searchResults.length > 1 ? 's' : ''} trouvée${searchResults.length > 1 ? 's' : ''}`}
            </div>
            {searchResults.length === 0 ? (
              <p className="text-gray-500 text-center">Aucun résultat trouvé.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recettes/${recipe.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    aria-label={`Voir la recette ${recipe.title}`}
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
{!hasSearched && (
  <section
    className="block lg:hidden mb-16"
    role="region"
    aria-labelledby="section-dernieres-recettes"
  >
    <h2 className="text-2xl font-bold mb-6" id="section-dernieres-recettes">
      Les dernières recettes
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {latestRecipes.slice(0, 6).map((recipe) => (
        <Link
          key={recipe.id}
          to={`/recettes/${recipe.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          // ✅ Pas besoin de aria-label ici : le contenu textuel (titre) est visible et informatif
        >
          <div className="relative h-48">
            <RecipeImage
              recipe={recipe}
              alt={recipe.title} // ✅ Très important : alt descriptif visible pour les lecteurs d'écran
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
            {/* ✅ Titre visible, donc pas besoin d'aria-label sur le Link */}
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
                  <FaClock aria-hidden="true" />
                  {/* ✅ aria-hidden car décoratif : le texte "X min" suffit */}
                </span>
                {recipe.duration} min
              </span>
              <span className="flex items-center gap-2">
                <span className="text-customYellow">
                  <FaTools aria-hidden="true" />
                  {/* ✅ idem : icône décorative */}
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
        aria-label="Explorer toutes les recettes disponibles"
      >
        Explorer toutes les recettes{' '}
        <span className="transform transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  </section>
)}


        {/* Liens sociaux */}
        {/* Footer sans liens sociaux */}
        <footer className="mt-16 py-8 border-t" role="contentinfo" aria-label="Pied de page du site">{/* Footer épuré, liens sociaux retirés */}</footer>
      </div>
    </div>
  );
};

export default HomePage;
