import { ApiResponse } from './../types/index';
import axios from "axios";
import { Recipe } from "../types/index";
const API_URL =  "http://localhost:3001/api";
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

    // Récupérer une recette par son ID
    async getRecipeById(id: number): Promise<ApiResponse<Recipe>> {
        try {
            const response = await axios.get(`${API_URL}/recipes/${id}`);
            console.log('Recette récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la recette ${id}:`, error);
            throw error;
        }
    }
}

  export const apiService = ApiService.getInstance();