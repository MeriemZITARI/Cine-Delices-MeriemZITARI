const TMDB_API_KEY = '1923f2b998e0a232766db7ede4e6c1b9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovies = async (query: string) => {
  const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (movieId: number) => {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR`;
  const response = await fetch(url);
  return await response.json();
};

export const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.jpg';
  return `${IMAGE_BASE_URL}${path}`;
};
