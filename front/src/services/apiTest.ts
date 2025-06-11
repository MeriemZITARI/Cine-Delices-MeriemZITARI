import { ApiResponse } from './../types/index';
import axios from "axios";
import { Recipe } from "../types/index";

const API_URL = "http://localhost:3001/api/";

class ApiService {
    private static instance: ApiService;
    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    // Récupérer toutes les recettes
    async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
        try {
            const response = await axios.get(`${API_URL}/recipes`);
            console.log('Recettes récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des recettes:', error);
            throw error;
        }
    }

    // Récupérer une recette par son ID
    async getRecipeById(id: string): Promise<ApiResponse<Recipe | undefined>> {
        try {
            const response = await axios.get(`${API_URL}/recipes/${id}`);
            console.log(`Recette ${id} récupérée:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la recette ${id}:`, error);
            throw error;
        }
    }
}

export const apiService = ApiService.getInstance();