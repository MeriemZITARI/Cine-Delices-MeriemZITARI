import { useState } from "react";
import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { authUserAtom } from "../../store/authUserAtom";
import SearchForm from "../SearchForm/SearchForm";
import { searchRecipes } from '../../utils/handleSearch';
import { IRecipe } from "../../types/Recipe";

interface NavMobileProps {
  className?: string; // Permet de passer des classes CSS pour afficher/masquer le menu mobile
}

const NavMobile: React.FC<NavMobileProps> = ({ className }) => {
    const [authUser] = useAtom(authUserAtom);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
    const [loading, setLoading] = useState(false);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const toggleSearchModal = () => {
      setIsSearchModalOpen(!isSearchModalOpen);
    };
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      setLoading(true);
    
      try {
        const filteredRecipes = await searchRecipes({
          searchTerm,
          selectedDuration,
          selectedType,
        });
        console.log('Recettes filtrées:', filteredRecipes);
        setSearchResults(filteredRecipes);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
        toggleSearchModal(); // Ferme la modale après la recherche
      }
    };

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
            { authUser ? (
              <Link
                to="/mon-compte"
                className="flex items-center justify-center h-full text-black"
              >
                <FaUserCircle size={36} />
              </Link>
             ) : (
              // Icône pour "Mon compte" si connecté
              <Link
                to="/login"
                className="flex items-center justify-center h-full text-black"
              >
                <FaUserCircle size={36} />
              </Link>
            )}
          </div>

          {/* Menu déroulant */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-50">
              <ul className="flex justify-center py-2 text-xl" style={{ fontFamily: 'Broadway, sans-serif' }}>
                <li className="mx-4">
                  <Link
                    to="/recettes"
                    className="text-black font-medium"
                  >
                    Recettes
                  </Link>
                </li>
                <li className="mx-4">
                  <Link
                    to="/films"
                    className="text-black font-medium"
                  >
                    Films
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
      
      {/* Modale de recherche */}
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
          </div>
        </div>
      )}
    </>
  );
};

export default NavMobile;
