/**
 * SearchModalContext.tsx
 * Contexte React pour gérer l'état de visibilité de la barre de recherche
 * Fournit les fonctions pour afficher/masquer la recherche dans toute l'application
 */

import React, { createContext, useContext, useState } from 'react';

/**
 * Interface définissant les propriétés et méthodes du contexte
 * @property isSearchVisible - État de visibilité de la recherche
 * @property toggleSearch - Fonction pour basculer la visibilité
 * @property hideSearch - Fonction pour masquer la recherche
 */
interface SearchModalContextType {
  isSearchVisible: boolean;
  toggleSearch: () => void;
  hideSearch: () => void;
}

// Création du contexte avec une valeur initiale undefined
const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

/**
 * Provider du contexte de recherche
 * Gère l'état et fournit les méthodes de contrôle aux composants enfants
 */
export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  // État local pour la visibilité de la recherche
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Bascule la visibilité de la recherche
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // Masque la recherche
  const hideSearch = () => {
    setIsSearchVisible(false);
  };

  // Fournit le contexte aux composants enfants
  return (
    <SearchModalContext.Provider value={{ isSearchVisible, toggleSearch, hideSearch }}>
      {children}
    </SearchModalContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte de recherche
 * @throws {Error} Si utilisé en dehors du Provider
 * @returns {SearchModalContextType} Le contexte de recherche
 */
export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}
