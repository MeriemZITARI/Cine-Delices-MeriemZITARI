import React, { useState } from "react";
import { useSearchMovies } from "../hooks/query/movie";
import { useMovieDetails } from "../hooks/query/movie";
import { getImageUrl } from "../services/Tmdb.Api";

export interface MovieSearchModalProps {
  onSelect: (movie: any) => void;
  onClose: () => void;
  open?: boolean;
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
  const [search, setSearch] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Query pour chercher les films selon le texte de recherche
  const { data: results = [], isLoading: isSearching } = useSearchMovies(search);

  // Query pour charger les détails du film sélectionné
  const {
    data: selectedMovieDetails,
    isLoading: isLoadingDetails,
  } = useMovieDetails(selectedMovieId ?? undefined);

  // Quand on sélectionne un film dans la liste
  const handleSelect = (movie: { id: number }) => {
    setSelectedMovieId(movie.id);
    // On appelle la fonction onSelect avec le détail du film après le chargement
    // Pour ça, on utilise un useEffect ou on peut aussi appeler onSelect dans un useEffect après le chargement
  };

  // On déclenche onSelect lorsque selectedMovieDetails change (après le chargement)
  React.useEffect(() => {
    if (selectedMovieDetails) {
      onSelect(selectedMovieDetails);
    }
  }, [selectedMovieDetails, onSelect]);

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
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        {isSearching && <div className="text-center text-gray-500">Recherche...</div>}
        <ul className="max-h-64 overflow-y-auto">
          {results.length === 0 && !isSearching && search.trim() !== "" && (
            <li className="text-gray-500 text-center py-4">Aucun film trouvé</li>
          )}
          {results.map((movie : Movie) => (
            <li
              key={movie.id}
              className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer rounded"
              onClick={() => handleSelect(movie)}
            >
              <img
                src={getImageUrl(movie.poster_path ?? "")}
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
        </ul>
        {/* Affichage du détail du film sélectionné */}
        {isLoadingDetails && <div className="mt-4 text-gray-500">Chargement détails...</div>}
        {selectedMovieDetails && !isLoadingDetails && (
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
