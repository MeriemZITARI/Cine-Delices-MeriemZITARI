interface MovieDetails {
    Title: string;
    Year: string;
    Poster: string;
    Plot: string;
    Director: string;
    imdbRating: string;
  }
  
  class MovieApiService {
    private apiKey: string;
    private baseUrl: string;
  
    constructor() {
      this.apiKey = 'YOUR_OMDB_API_KEY'; // Remplacer par votre clé API OMDB
      this.baseUrl = 'http://www.omdbapi.com';
    }
  
    async getMovieDetailsByImdbId(imdbId: string): Promise<MovieDetails | null> {
      try {
        const response = await fetch(`${this.baseUrl}/?i=${imdbId}&apikey=${this.apiKey}`);
        const data = await response.json();
        
        if (data.Response === 'False') {
          console.error('Film non trouvé:', data.Error);
          return null;
        }
  
        return data as MovieDetails;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        return null;
      }
    }
  
    async searchMovieByTitle(title: string): Promise<MovieDetails[]> {
      try {
        const response = await fetch(`${this.baseUrl}/?s=${encodeURIComponent(title)}&apikey=${this.apiKey}`);
        const data = await response.json();
        
        if (data.Response === 'False') {
          console.error('Aucun film trouvé:', data.Error);
          return [];
        }
  
        return data.Search;
      } catch (error) {
        console.error('Erreur lors de la recherche de films:', error);
        return [];
      }
    }
  }
  
  export const movieApiService = new MovieApiService();
  export type { MovieDetails };
  