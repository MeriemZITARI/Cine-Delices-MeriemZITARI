import croquemonsieurImage from "@/assets/recipe/croque-monsieur.jpg";
import lasagnesImage from "@/assets/recipe/lasagnes.jpg";
import ratatouilleImage from "@/assets/recipe/ratatouille.jpg";

// Service pour récupérer des images de recettes
const RecipeImageService = {
  // Collection d'images de recettes locales
  recipeImages: {
    "Croque Monsieur": croquemonsieurImage,
    "Lasagnes": lasagnesImage,
    "Ratatouille": ratatouilleImage,
  },

  // Fonction pour obtenir l'image d'une recette par son titre
  getRecipeImage(title: string): string | null {
    try {
      console.log('RecipeImageService: recherche d\'image pour', title);
      
      // Si le titre est vide, retourner null
      if (!title) {
        console.error('RecipeImageService: titre vide');
        return null;
      }

      const normalizedTitle = title.toLowerCase();
      console.log('RecipeImageService: titre normalisé', normalizedTitle);

      // Vérifier si nous avons une image locale pour cette recette
      for (const [recipeTitle, imageUrl] of Object.entries(this.recipeImages)) {
        const normalizedRecipeTitle = recipeTitle.toLowerCase();
        console.log('RecipeImageService: comparaison avec', normalizedRecipeTitle);
        
        if (normalizedTitle === normalizedRecipeTitle || 
            normalizedTitle.includes(normalizedRecipeTitle) || 
            normalizedRecipeTitle.includes(normalizedTitle)) {
          console.log('RecipeImageService: correspondance trouvée pour', recipeTitle, imageUrl);
          return imageUrl;
        }
      }
      
      console.log('RecipeImageService: aucune image trouvée');
      return null;
    } catch (error) {
      console.error("RecipeImageService: erreur lors de la récupération de l'image:", error);
      return null;
    }
  }
};

export default RecipeImageService;
