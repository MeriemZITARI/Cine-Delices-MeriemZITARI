/*
/**
 * api.ts
 * Service principal pour les appels API
 * En mode développement, simule les appels avec un fichier JSON local
 * En production, utilise Axios pour les appels réels
 */
/*
import axios, { AxiosInstance } from "axios";
import db from "../data/db.json";
import type { Recipe, Category } from "../types";

// Définition locale du type ApiResponse
interface ApiResponse<T> {
  data: T;
}


 // Configuration de l'instance Axios
 // Définit l'URL de base et les headers par défaut
 
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


 // Simule un délai réseau pour le développement
 // @param ms - Délai en millisecondes
 // @returns Promise qui se résout après le délai
 
const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));


 // Service des recettes
 // Gère toutes les opérations liées aux recettes
 //Utilise une simulation en développement, avec transition facile vers l'API réelle



export const recipeService = {
  
    //Récupère toutes les recettes
   // @returns Liste des recettes avec leur détails
   
  getAllRecipes: async (): Promise<ApiResponse<Recipe[]>> => {
    await simulateDelay();
    return { data: db.recipes };
    // En production : return api.get<Recipe[]>('/recipes');
  },

  // Récupérer une recette par son ID
  getRecipeById: async (id: string): Promise<ApiResponse<Recipe | undefined>> => {
    await simulateDelay();
    const recipe = db.recipes.find((r) => r.id === id);
    return { data: recipe };
    // En production : return api.get<Recipe>(`/recipes/${id}`);
  },

  // Rechercher des recettes
  searchRecipes: async (query: string): Promise<ApiResponse<Recipe[]>> => {
    await simulateDelay();
    const filteredRecipes = db.recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase())
    );
    return { data: filteredRecipes };
    // En production : return api.get<Recipe[]>(`/recipes/search?query=${query}`);
  },

  // Filtrer les recettes par catégorie
  getRecipesByCategory: async (categoryId: number): Promise<ApiResponse<Recipe[]>> => {
    await simulateDelay();
    const filteredRecipes = db.recipes.filter(
      (recipe) => recipe.category.id === categoryId
    );
    return { data: filteredRecipes };
    // En production : return api.get<Recipe[]>(`/recipes/category/${categoryId}`);
  }
};

export const categoryService = {
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    await simulateDelay();
    return { data: db.categories };
  },

  getCategoryById: async (id: number): Promise<ApiResponse<Category | undefined>> => {
    await simulateDelay();
    const category = db.categories.find((c) => c.id === id);
    return { data: category };
  }
};

export const movieService = {
  getMovieByTitle: async (title: string): Promise<ApiResponse<any>> => {
    await simulateDelay();
    // Simuler une réponse d'API de film
    return {
      data: {
        id: "123",
        title: title,
        year: "2023",
        poster: null
      }
    };
  }
};
*/