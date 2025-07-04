// hooks/query/movies.ts
import { useQuery } from "@tanstack/react-query";
import MovieService from "../../services/api/MovieService"; 
import { IMovie } from "../../types/Movies";
import { searchMovies } from '../../services/Tmdb.Api';
import { getMovieDetails } from '../../services/Tmdb.Api';

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query, // n'exécute la requête que si query est défini
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
export const useAllMovies = () => {
  return useQuery<IMovie[]>({
    queryKey: ["movies"],
    queryFn: MovieService.getMovies,
  });
};
export const useMovieById = (id: string) => {
    return useQuery<IMovie>({
      queryKey: ['movie', id],
      queryFn: () => MovieService.getMovie(id),
      enabled: !!id, // n'exécute la requête que si un id est fourni
    });
};

export function useMovieDetails(movieId?: number) {
  return useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: () => getMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

