import axios from 'axios';

// Interface pour représenter la structure d'un ingrédient
export interface Ingredient {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// L'URL de base de l'API
const API_URL = 'http://localhost:3000/api';

/**
 * Récupère tous les ingrédients depuis l'API
 * @returns Promise contenant un tableau d'ingrédients
 */
export const getIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await axios.get(`${API_URL}/ingredients/all?limit=9999999999`);
    console.log('Ingrédients récupérés avec succès:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error);
    throw error;
  }
};

/**
 * Ajoute un nouvel ingrédient
 * @param name Le nom du nouvel ingrédient
 * @returns Promise contenant l'ingrédient créé
 */
export const addIngredient = async (name: string): Promise<Ingredient> => {
  try {
    const response = await axios.post(`${API_URL}/ingredients`, { name });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un ingrédient:', error);
    throw error;
  }
};