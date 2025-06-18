import React, { useState, useEffect } from "react";
import axios from "axios";
import { searchMovies, getMovieDetails, getImageUrl } from '../services/Tmdb.Api';

export interface MovieSearchModalProps {
  onSelect: (movie: any) => void;
  onClose: () => void;
  open?: boolean;
  // autres props éventuels...
}

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
}

const MovieSearchModal: React.FC<MovieSearchModalProps> = ({
  onSelect,
  onClose,
  open = true,
}) => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState<Movie | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchMovies(search)
      .then((data: any[]) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [search]);

  // Lorsqu'un film est sélectionné, récupère ses détails
  const handleSelect = async (movie: Movie) => {
    const details = await getMovieDetails(movie.id);
    setSelectedMovieDetails(details);
    onSelect(details);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4">Rechercher un film</h3>
        <input
          type="text"
          className="form-control w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Titre du film..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        {loading && <div className="text-center text-gray-500">Recherche...</div>}
        <ul className="max-h-64 overflow-y-auto">
          {results.map(movie => (
            <li
              key={movie.id}
              className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer rounded"
              onClick={() => handleSelect(movie)}
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <div className="font-semibold">{movie.title}</div>
                {movie.overview && (
                  <div className="text-xs text-gray-500 line-clamp-2">{movie.overview}</div>
                )}
              </div>
            </li>
          ))}
          {!loading && search && results.length === 0 && (
            <li className="text-gray-500 text-center py-4">Aucun film trouvé</li>
          )}
        </ul>
        {/* Affichage du détail du film sélectionné (optionnel) */}
        {selectedMovieDetails && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <div className="flex gap-4">
              <img
                src={getImageUrl(selectedMovieDetails.poster_path)}
                alt={selectedMovieDetails.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <div className="font-bold">{selectedMovieDetails.title}</div>
                <div className="text-sm text-gray-600 mt-2">{selectedMovieDetails.overview}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearchModal;

