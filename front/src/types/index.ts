/**
 * Types principaux de l'application
 * Définit les structures de données essentielles
 */

/**
 * Interface Recipe
 * Représente une recette avec tous ses détails
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: {
      ingredientId: string;
      quantity: number;
      unit: string;
  }[];
  instructions: string[];
  duration: number;
  difficulty: number;
  image: string;
    category?: {
        id: string;
        name: string;
    };
    movie?: {
        id: string;
        title: string;
        poster?: string;
    };
    author?: {
        id: string;
        firstName: string;
        lastName: string;
    };
  }
  
  /**
   * Interface Category
   * Représente une catégorie de recettes
   */
  export interface Category {
    id: number;           // Identifiant unique
    name: string;         // Nom de la catégorie
  }
  
  /**
   * Interface Movie
   * Représente un film associé à une recette
   */
  export interface Movie {
    id: string;           // Identifiant unique
    title: string;        // Titre du film
    year: string;         // Année de sortie
    poster?: string;      // URL de l'affiche (optionnel)
  }
  
  /**
   * Interface ApiResponse
   * Wrapper générique pour les réponses API
   * @template T - Type de données retourné
   */
  export interface ApiResponse<T> {
    data: T;              // Données retournées par l'API
  }
  
  /**
   * Interface SearchFilters
   * Critères de recherche et filtrage des recettes
   */
  export interface SearchFilters {
    searchTerm?: string;    // Terme de recherche
    duration?: number;      // Durée exacte
    category?: number;      // ID de catégorie
    minDuration?: number;   // Durée minimum
    maxDuration?: number;   // Durée maximum
    difficulty?: string;    // Niveau de difficulté
  }
  
  /**
   * Interface ButtonProps
   * Props pour le composant Button personnalisé
   */
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';  // Style du bouton
    size?: 'default' | 'sm' | 'lg';            // Taille du bouton
    children: React.ReactNode;                  // Contenu du bouton
  }
  
  /**
   * Interface CardProps
   * Props pour le composant Card
   */
  export interface CardProps {
    children: React.ReactNode;                  // Contenu de la carte
    className?: string;                         // Classes CSS additionnelles
  }
  