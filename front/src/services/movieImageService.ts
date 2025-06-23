import axios from "axios";
import garfieldImage from "@/assets/movies/garfield.jpg";
import guardiansImage from "@/assets/movies/guardians.jpg";
import ratatouilleImage from "@/assets/movies/ratatouille.jpg";

interface OmdbResponse {
  Response: "True" | "False";
  Poster?: string;
  Error?: string;
}

// Service pour récupérer des images de films
const MovieImageService = {
  // Clé API gratuite pour OMDb (limitée à 1000 requêtes par jour)
  API_KEY: "3e974fca",

  // Collection d'images de films locales
  moviePosters: {
    "Garfield": garfieldImage,
    "Les Gardiens de la Galaxie": guardiansImage,
    "Ratatouille": ratatouilleImage,
  },

  // Fonction pour obtenir l'affiche d'un film par son titre
  async getMoviePosterByTitle(title: string, year: string = "", id: string): Promise<string | null> {
    try {
      //console.log('MovieImageService: recherche d\'image pour', title);
      
      // Si le titre est vide, retourner null
      if (!title) {
        //console.error('MovieImageService: titre vide');
        return null;
      }

      const normalizedTitle = title.toLowerCase();
      //console.log('MovieImageService: titre normalisé', normalizedTitle);

      // D'abord vérifier si nous avons une affiche locale pour ce film
      for (const [movieTitle, posterUrl] of Object.entries(this.moviePosters)) {
        const normalizedMovieTitle = movieTitle.toLowerCase();
        //console.log('MovieImageService: comparaison avec', normalizedMovieTitle);
        
        if (normalizedTitle === normalizedMovieTitle || 
            normalizedTitle.includes(normalizedMovieTitle) || 
            normalizedMovieTitle.includes(normalizedTitle)) {
          //console.log('MovieImageService: correspondance trouvée pour', movieTitle, posterUrl);
          return posterUrl;
        }
      }

      // Si aucune image locale n'est trouvée, essayer l'API OMDb
      //console.log('MovieImageService: aucune image locale trouvée, tentative avec OMDb');
      const yearParam = year ? `&y=${year}` : "";
      const response = await axios.get<OmdbResponse>(
        `https://www.omdbapi.com/?apikey=${this.API_KEY}&i=${id}`
      );

      if (
        response.data &&
        response.data.Response === "True" &&
        response.data.Poster &&
        response.data.Poster !== "N/A"
      ) {
        //console.log('MovieImageService: image OMDb trouvée');
        return response.data.Poster;
      }
      
      //console.log('MovieImageService: aucune image trouvée');
      return null;
    } catch (error) {
      console.error("MovieImageService: erreur lors de la récupération de l'affiche du film:", error);
      return null;
    }
  }
};

export default MovieImageService;
