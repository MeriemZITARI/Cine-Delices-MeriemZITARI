import type React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserCircle, FaSearch, FaBars } from "react-icons/fa"; // Exemple d'icône pour "Mon compte"
import Button from "../Button/Button";

const Header: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white text-black px-4 py-2 shadow-md relative">
        <div className="container mx-auto flex items-center justify-between h-16">
          {/*<nav className="hidden">
            <NavLink 
              to="/recettes" 
              className={location.pathname === "/recettes" ? "underline" : ""}
            >
              Recettes
            </NavLink>
            <NavLink
              to="/films"
              className={location.pathname === "/films" ? "underline" : ""}
            >
              Films
            </NavLink>
          </nav>*/}
          <div className="flex items-center h-full">
            <button 
              type="button"
              className="text-black md:hidden" 
              onClick={toggleMenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') toggleMenu();
              }}
            >
              <FaBars size={36} />
            </button>
            <button 
              type="button"
              className="text-black md:hidden ml-4"
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
              to="/mon-compte"
              className="flex items-center justify-center h-full text-black"
            >
              <FaUserCircle size={36} />
            </Link>
          </div>

          {/* Menu déroulant */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-50">
              <ul className="flex justify-center py-2" style={{ fontFamily: 'Broadway, sans-serif' }}>
                <li className="mx-4">
                  <Link
                    to="/recettes"
                    className="text-gray-700 hover:text-black font-medium"
                    onClick={toggleMenu}
                  >
                    Recettes
                  </Link>
                </li>
                <li className="mx-4">
                  <Link
                    to="/films"
                    className="text-gray-700 hover:text-black font-medium"
                    onClick={toggleMenu}
                  >
                    Films
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* <div className="hidden flex items-center">
          <Button text="Se connecter / S'inscrire" />
        </div>*/}
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
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Rechercher</h2>
            <form>
              {/* Champ "Je cherche" */}
              <div className="mb-4">
                <label htmlFor="search" className="block text-m font-bold text-gray-700 mb-2">
                  Je cherche...
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Lasagnes, Star Wars, ..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Champ "J'ai..." */}
              <div className="mb-4">
                <label htmlFor="time" className="block text-m font-bold text-gray-700 mb-2">
                  J'ai...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      value="15"
                      className="mr-2"
                    />
                    15 minutes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      value="30"
                      className="mr-2"
                    />
                    30 minutes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      value="45"
                      className="mr-2"
                    />
                    45 minutes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      value="60+"
                      className="mr-2"
                    />
                    60+ minutes
                  </label>
                </div>
              </div>
              
              {/* Champ "Je veux préparer..." */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-m font-bold text-gray-700 mb-2">
                  Je veux préparer...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="entrée"
                      className="mr-2"
                    />
                    Entrée
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="plat"
                      className="mr-2"
                    />
                    Plat
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="dessert"
                      className="mr-2"
                    />
                    Dessert
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="boisson"
                      className="mr-2"
                    />
                    Boisson
                  </label>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-2">
                <Button
                  text="Annuler"
                  className="bg-gray-500 hover:bg-gray-600"
                  onClick={toggleSearchModal}
                />
                <Button
                  text="Rechercher"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
