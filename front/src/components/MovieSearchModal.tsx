import React, { useState } from 'react';
import { searchMovies, getMovieDetails, getImageUrl } from '../services/Tmdb.Api';

interface MovieSearchModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (movie: any) => void;
}

const MovieSearchModal: React.FC<MovieSearchModalProps> = ({ visible, onCancel, onSelect }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[]>([]); // Changement pour un tableau

  const searchMovie = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setMovies([]); // Réinitialisation du tableau

    try {
      const results = await searchMovies(query.trim());
      setMovies(results);
    } catch (err) {
      setError('Erreur lors de la recherche du film');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie: any) => {
    try {
      const details = await getMovieDetails(movie.id);
      onSelect({
        title: movie.title, // changé de Title à title
        release_date: movie.release_date,
        overview: details.overview, // changé de Plot à overview
        id: movie.id, // changé de imdbID à id
        poster_path: movie.poster_path // changé de Poster à poster_path
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des détails:', err);
      onSelect(movie);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Rechercher un film</h2>
        
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchMovie()}
            placeholder="Entrez le titre du film"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <button 
            onClick={searchMovie}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {error && (
          <div style={{ 
            color: '#dc3545',
            padding: '10px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '10px'
        }}>
          {/* En-tête du tableau */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 150px 200px 100px',
            gap: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0
          }}>
            <div>Poster</div>
            <div>Titre</div>
            <div>Année</div>
            <div>Description</div>
            <div>Action</div>
          </div>

          {/* Liste des films */}
          {movies.map((movie) => (
            <div key={movie.id} style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 150px 150px 100px',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #ddd',
              alignItems: 'center'
            }}>
              <img 
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div style={{ fontSize: '16px' }}>{movie.title}</div>
              <div style={{ color: '#666' }}>{movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : 'Date inconnue'}</div>
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {movie.overview}
              </div>
              <button 
                onClick={() => handleSelectMovie(movie)}
                style={{
                  padding: '8px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sélectionner
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default MovieSearchModal;




