// hooks/query/movies.ts
import { useQuery } from "@tanstack/react-query";
import MovieService from "../../services/api/MovieService"; 
import { IMovie } from "../../types/Movies";
import { searchMovies } from '../../services/Tmdb.Api';
import { getMovieDetails } from '../../services/Tmdb.Api';

/**  
* Utilise useQuery pour rechercher des films par titre.
* @param query - Le titre du film à rechercher.
* @returns Un objet de requête contenant les données du film, l'état de chargement, et les erreurs éventuelles.
* appelle l'API externe pour récupérer les films correspondants au titre.
*/

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query, // n'exécute la requête que si query est défini
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**    
* Utilise useQuery pour récupérer tous les films.
* @returns Un objet de requête contenant la liste de tous les films, l'état de chargement, et les erreurs éventuelles.
* appelle le service MovieService (API backend (Express) ) pour récupérer la liste des films.
*/
export const useAllMovies = () => {
  return useQuery<IMovie[]>({
    queryKey: ["movies"],
    queryFn: MovieService.getMovies,
  });
};

/** Utilise useQuery pour récupérer un film par son ID.
* @param id - L'identifiant du film à récupérer.
* @returns Un objet de requête contenant les détails du film, l'état de chargement, et les erreurs éventuelles.
* appelle le service MovieService (API backend (Express) ) pour récupérer les détails du film par son ID.
*/
export const useMovieById = (id: string) => {
    return useQuery<IMovie>({
      queryKey: ['movie', id],
      queryFn: () => MovieService.getMovie(id),
      enabled: !!id, // n'exécute la requête que si un id est fourni
    });
};

/** Utilise useQuery pour récupérer les détails d'un film par son ID.
 * @param movieId - L'identifiant du film dont on veut récupérer les détails.
 * @returns Un objet de requête contenant les détails du film, l'état de chargement, et les erreurs éventuelles.
 * Cette fonction appelle l'API externe pour obtenir les détails du film.
 */
export function useMovieDetails(movieId?: number) {
  return useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: () => getMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

