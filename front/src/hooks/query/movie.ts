// hooks/query/movies.ts
import { useQuery } from "@tanstack/react-query";
import MovieService from "../../services/api/MovieService"; 
import { IMovie } from "../../types/Movies";

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

