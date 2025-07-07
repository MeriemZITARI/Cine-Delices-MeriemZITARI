import { useState } from "react";
import { FaBars, FaClock, FaSearch, FaTools, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchForm from "../SearchForm/SearchForm";
import { searchRecipes } from '../../utils/handleSearch';
import { IRecipe } from "../../types/Recipe";

import { useAuthUser } from "../../hooks/query/auth"; // ✅ Hook React Query
import RecipeImage from "../RecipeImage";
import getDifficultyText from "../../utils/getDifficulty";

interface NavMobileProps {
  className?: string;
}

const NavMobile: React.FC<NavMobileProps> = ({ className }) => {
  const { data: authUser, isLoading } = useAuthUser(); // ✅ Auth state

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const filteredRecipes = await searchRecipes({
        searchTerm,
        selectedDuration,
        selectedType,
      });
      setSearchResults(filteredRecipes);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
      
    }
  };

  // ✅ Pendant le chargement, on bloque le rendu
  if (isLoading) {
    return (
      <header className={`bg-white text-black px-4 py-2 shadow-md relative ${className}`}>
        <div className="container mx-auto flex items-center justify-center h-16">
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`bg-white text-black px-4 py-2 shadow-md relative ${className}`}
        onClick={() => {
          if (isMenuOpen) setIsMenuOpen(false);
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center h-full md:hidden">
            <button
              type="button"
              className="text-black"
              onClick={toggleMenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') toggleMenu();
              }}
            >
              <FaBars size={36} />
            </button>
            <button
              type="button"
              className="text-black ml-4"
              onClick={toggleSearchModal}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') toggleSearchModal();
              }}
            >
              <FaSearch size={36} />
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center h-full absolute left-1/2 transform -translate-x-1/2"
          >
            <img
              src="/images/logo/logo.png"
              alt="Ciné Délices Logo"
              className="h-16"
            />
          </Link>

          <div className="flex items-center h-full">
            <Link
              to={authUser ? "/mon-compte" : "/connexion"}
              className="flex items-center justify-center h-full text-black"
            >
              <FaUserCircle size={36} />
            </Link>
          </div>

          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-50">
              <ul className="flex justify-center py-2 text-xl" style={{ fontFamily: 'Broadway, sans-serif' }}>
                <li className="mx-4">
                  <Link to="/recettes" className="text-black font-medium">
                    Recettes
                  </Link>
                </li>
                <li className="mx-4">
                  <Link to="/films" className="text-black font-medium">
                    Films
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {isSearchModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleSearchModal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') toggleSearchModal();
          }}
        >
          <div
            className="bg-white p-1 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchForm
              onSubmit={handleSearch}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDuration={selectedDuration}
              onDurationSelect={setSelectedDuration}
              selectedType={selectedType}
              onTypeSelect={setSelectedType}
            />
           {!loading && searchResults.length > 0 && (
  <section
    className="mb-16 block max-h-[60vh] overflow-auto"
    role="region"
    aria-labelledby="section-results-mobile"
  >
    <h2
      className="text-2xl font-bold mb-6 text-red-600"
      id="section-results-mobile"
    >
      Résultats de la recherche
    </h2>
    <div aria-live="polite" className="sr-only">
      {searchResults.length === 0
        ? "Aucun résultat trouvé."
        : `${searchResults.length} recette${searchResults.length > 1 ? 's' : ''} trouvée${searchResults.length > 1 ? 's' : ''}`}
    </div>
    <div className="grid grid-cols-1 gap-6">
      {searchResults.map(recipe => (
        <Link
          key={recipe.id}
          to={`/recettes/${recipe.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          onClick={toggleSearchModal}
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
                <FaClock className="text-customYellow" />
                {recipe.duration} min
              </span>
              <span className="flex items-center gap-2">
                <FaTools className="text-customYellow" />
                {getDifficultyText(recipe.difficulty)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}
  

          </div>
         
        </div>
      )}
    </>
  );
};

export default NavMobile;
