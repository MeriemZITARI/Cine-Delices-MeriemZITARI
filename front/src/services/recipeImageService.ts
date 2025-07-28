// Service pour récupérer des images de recettes depuis le backend
const API_URL = import.meta.env.VITE_API_URL;

const RecipeImageService = {
  // Fonction pour obtenir l'URL de l'image d'une recette
  getRecipeImage(backendImage: string): string {
    if (!backendImage) {
      console.error("RecipeImageService: nom de fichier d'image manquant");
      return "";
    }
    const baseUrl = `${API_URL}/images-recettes`;
    return `${baseUrl}/${backendImage}?qf`;
  },
};

export default RecipeImageService;