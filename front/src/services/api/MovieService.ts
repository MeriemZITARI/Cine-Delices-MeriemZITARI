import type { IMovie } from '../../types/Movies';
import { axiosInstance } from '../../utils/axios';
import { AxiosError } from 'axios';

const MovieService = {
  async getMovies(): Promise<IMovie[]> {
    const response = await axiosInstance.get('/api/movies');
    return response.data;
  },

  async getMovie(id: string) {
    const response = await axiosInstance.get(`/api/movies/${id}`);
    return response.data as IMovie;
  },

  async createMovie(movie: Omit<IMovie, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await axiosInstance.post('/api/movies', movie);
    return response.data as IMovie;
  },

  async updateMovie(id: string, movie: Partial<IMovie>) {
    const response = await axiosInstance.put(`/api/movies/${id}`, movie);
    return response.data as IMovie;
  },

  async deleteMovie(id: string) {
    await axiosInstance.delete(`/api/movies/${id}`);
  },

  async getMoviesByGenre(genre: string) {
    const response = await axiosInstance.get(`/api/movies/genre/${genre}`);
    return response.data as IMovie[];
  },

  async searchMovies(query: string) {
    const response = await axiosInstance.get('/api/movies/search', {
      params: { q: query }
    });
    return response.data as IMovie[];
  },

  async getLatestMovies(limit: number = 10) {
    const response = await axiosInstance.get('/api/movies/latest', {
      params: { limit }
    });
    return response.data as IMovie[];
  }
};

export default MovieService;