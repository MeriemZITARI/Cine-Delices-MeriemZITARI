// Service pour récupérer des images de recettes depuis le backend
const RecipeImageService = {
  // Fonction pour obtenir l'URL de l'image d'une recette
  getRecipeImage(backendImage: string): string {
    if (!backendImage) {
      console.error("RecipeImageService: nom de fichier d'image manquant");
      return "";
    }
    const baseUrl = "http://localhost:3001/images-recettes";
    return `${backendImage}?qf`;
  },
};

export default RecipeImageService;