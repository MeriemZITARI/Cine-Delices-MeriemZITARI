import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../../services/api/RecipeService';

import type { IRecipe } from '../../types/Recipe';
import type { IMovie } from '../../types/Movies';
import RecipeImage from '../RecipeImage';
import MoviePoster from '../MoviePoster';
import { Button } from '../ui/button';
import RecipeCarouselNew from '../RecipeCarousselNew';
import './HomePageNew.css';

// Interfaces
interface SearchFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDuration: number | null;
  onDurationSelect: (duration: number) => void;
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

// Using imported IMovie interface

// Composant SearchForm
const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  searchTerm,
  onSearchChange,
  selectedDuration,
  onDurationSelect,
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Je cherche...</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Retrouvez votre recette préférée de film"
          className="w-full p-3 border rounded-md mb-4"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        />
        
        <h3 className="font-medium mb-2">J'ai...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[15, 30, 45, 60].map((duration) => (
            <label key={duration} className="flex items-center">
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === duration}
                onChange={() => onDurationSelect(duration)}
                className="custom-radio"
              />
              {duration} minutes
            </label>
          ))}
        </div>

        <h3 className="font-medium mb-2">Je veux préparer...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {['entrée', 'plat', 'dessert', 'boisson'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={selectedType === type}
                onChange={() => onTypeSelect(type)}
                className="custom-radio"
              />
              {type === 'entrée' ? 'Une entrée' :
              type === 'plat' ? 'Un plat principal' :
              type === 'dessert' ? 'Un dessert' : 'Une boisson'}
            </label>
          ))}
        </div>

        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
          C'est parti !
        </Button>
      </form>
    </div>
  );
};

// Composant principal HomePageNew
const HomePageNew: React.FC = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState<IRecipe | null>(null);
  const [latestRecipes, setLatestRecipes] = useState<IRecipe[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<IMovie[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipesResponse, moviesData] = await Promise.all([
          recipeService.getRecipes(),
         
        ]);

        if (recipesResponse?.data && recipesResponse.data.length > 0) {
          // Sélection aléatoire d'une recette pour la recette du jour
          const randomIndex = Math.floor(Math.random() * recipesResponse.data.length);
          setFeaturedRecipe(recipesResponse.data[randomIndex]);
          setLatestRecipes(recipesResponse.data.slice(0, 3));
        }

        if (moviesData && moviesData.length > 0) {
          console.log('Movies response:', moviesData);
          setFeaturedMovies(moviesData.slice(0, 3));
        } else {
          console.log('Pas de films trouvés');
          setFeaturedMovies([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);    try {
      const response = await recipeService.getRecipes();
      let filteredRecipes = response.data;
      console.log("Recettes à filtrer:", filteredRecipes);

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

      console.log("Recettes filtrées:", filteredRecipes);
      setLatestRecipes(filteredRecipes);
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
      <div className="bg-gradient-to-b from-yellow-300 to-yellow-100 py-8">
        <div className="container mx-auto px-4">          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
            {/* Recette du jour - Plus grande sur desktop */}
            {featuredRecipe && (
              <div className="order-2 lg:order-1 lg:w-[65%]">
                <h2 className="text-xl font-bold mb-4">La recette du jour</h2>
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <RecipeImage
                    recipe={featuredRecipe}
                    alt={featuredRecipe.title}
                    className="w-full h-48 lg:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                    <Link to={`/recettes/${featuredRecipe.id}`} className="group">
                      <h1 className="text-xl lg:text-2xl font-bold mb-2 drop-shadow-md group-hover:text-yellow-300 transition-colors">
                        {featuredRecipe.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm">
                        <span>⏱️ {featuredRecipe.preparationTime} min</span>
                        <span>👨‍🍳 Difficulté: {featuredRecipe.difficulty}/5</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire de recherche */}
            <div className="order-1 lg:order-2 lg:w-[30%] mb-6 lg:mb-0">
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
        {/* Section films et carrousel */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Films et Recettes à l'affiche</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Film à l'affiche (30%) */}
            <div className="w-full lg:w-[30%]">
              {featuredMovies[0] && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transform hover:scale-[1.02] transition-transform duration-200">
                  <div className="relative h-[400px]">                    <MoviePoster 
                      imdbLink={featuredMovies[0].imdbLink}
                      alt={featuredMovies[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm inline-block w-fit mb-2">
                        Film du jour
                      </span>
                      <h3 className="text-white font-bold text-xl mb-2">{featuredMovies[0].title}</h3>
                      <p className="text-white/90 text-sm line-clamp-2">{featuredMovies[0].description}</p>
                      <div className="mt-2 text-white/80 text-sm">
                        {new Date(featuredMovies[0].releaseDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>            {/* Carrousel desktop uniquement (70%) */}
            <div className="hidden lg:block w-full lg:w-[70%]">
              {Array.isArray(latestRecipes) && latestRecipes.length > 0 ? (
                <RecipeCarouselNew recipes={latestRecipes} />
              ) : (
                <p className="text-gray-500 text-center">Aucune recette à afficher pour le moment.</p>
              )}
            </div>
          </div>
        </section>
        
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
                    <span>⏱️ {recipe.preparationTime} min</span>
                    <span>👨‍🍳 {recipe.difficulty}/5</span>
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
        <footer className="mt-16 py-8 border-t">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">Facebook</a>
            <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">Twitter</a>
            <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">YouTube</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePageNew;
