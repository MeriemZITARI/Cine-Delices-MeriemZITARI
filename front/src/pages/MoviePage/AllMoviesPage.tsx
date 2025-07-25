import { Link } from 'react-router-dom';
import { useAllMovies } from '../../hooks/query/movie';
import MovieImage from '../../components/MovieImage';
import SearchFormMovie from '../../components/SearchForm/SearchFormMovie';

import { useState } from 'react';

const AllMoviesPage: React.FC = () => {

  // Utilisation du hook personnalisé pour récupérer tous les films
  const { data: movies = [], isLoading, isError } = useAllMovies();
  // État local pour la recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Appliquer le filtre localement 
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // rien à faire ici car le filtre est local
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Erreur lors du chargement des films.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête et recherche */}
      <div className="bg-customYellow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6 font-broadway">Tous nos films</h1>
          <div className="max-w-lg mx-auto">
            <SearchFormMovie
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Affichage des films */}
      <div className="container mx-auto p-4">
        {filteredMovies.length === 0 ? (
          <p className="text-center text-gray-600">Aucun film trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="bg-white rounded-lg shadow-md p-4">
                <MovieImage movie={movie} />
                <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                <p className="text-gray-600">{movie.description}</p>
                <Link
                  to={`/films/${movie.id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
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
