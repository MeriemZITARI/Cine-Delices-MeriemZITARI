import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieService from '../../services/api/MovieService';

import type { IMovie } from '../../types/Movies';
import MovieImage from '../../components/MovieImage';
import SearchFormMovie from '../../components/SearchForm/SearchFormMovie';

const AllMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement initial des films
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await MovieService.getMovies();
        setMovies(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Recherche au submit du formulaire
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const allMovies = await MovieService.getMovies();
      const filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMovies(filtered);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête et formulaire de recherche */}
      <div className="bg-customYellow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Tous nos films</h1>
          <div className="max-w-lg mx-auto">
            <SearchFormMovie
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Liste des films */}
      <div className="container mx-auto p-4">
        {movies.length === 0 ? (
          <p className="text-center text-gray-600">Aucun film trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-white rounded-lg shadow-md p-4">
                <MovieImage movie={movie} />
                <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                <p className="text-gray-600">{movie.description}</p>
                <Link
                  to={`/movies/${movie.id}`}
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMoviesPage;
