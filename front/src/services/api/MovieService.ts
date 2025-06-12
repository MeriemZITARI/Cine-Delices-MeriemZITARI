import axios from 'axios';
import type { IMovie } from '../../types/Movies';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const MovieService = {
  async getMovies(): Promise<IMovie[]> {
    const response = await axios.get(`${apiUrl}/movies`);
    return response.data;
  },

  async getMovie(id: string) {
    const response = await axios.get(`${apiUrl}/movies/${id}`);
    return response.data as IMovie;
  },

  async createMovie(movie: Omit<IMovie, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await axios.post(`${apiUrl}/movies`, movie);
    return response.data as IMovie;
  },

  async updateMovie(id: string, movie: Partial<IMovie>) {
    const response = await axios.put(`${apiUrl}/movies/${id}`, movie);
    return response.data as IMovie;
  },

  async deleteMovie(id: string) {
    await axios.delete(`${apiUrl}/movies/${id}`);
  },

  async getMoviesByGenre(genre: string) {
    const response = await axios.get(`${apiUrl}/movies/genre/${genre}`);
    return response.data as IMovie[];
  },

  async searchMovies(query: string) {
    const response = await axios.get(`${apiUrl}/movies/search`, {
      params: { q: query }
    });
    return response.data as IMovie[];
  },

  async getLatestMovies(limit: number = 10) {
    const response = await axios.get(`${apiUrl}/movies/latest`, {
      params: { limit }
    });
    return response.data as IMovie[];
  }
};

export default MovieService;
