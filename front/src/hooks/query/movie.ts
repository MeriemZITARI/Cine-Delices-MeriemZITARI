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

