import React, { useState, useEffect } from 'react';

interface MoviePosterProps {
  imdbId?: string;
  imdbLink?: string;
  alt: string;
  className?: string;
}

const extractImdbId = (url: string): string | null => {
  try {
    const match = url.match(/title\/(tt\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const MoviePoster: React.FC<MoviePosterProps> = ({ imdbId, imdbLink, alt, className }) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Obtenir l'ID IMDB soit directement, soit depuis le lien
        const id = imdbId || (imdbLink ? extractImdbId(imdbLink) : null);
        
        if (!id) {
          setError(true);
          return;
        }
        
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la récupération de l\'affiche');
        }
        
        const data = await response.json();
        
        if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          setPosterUrl(data.Poster);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'affiche:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPoster();
  }, [imdbId, imdbLink, apiKey]);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || 'w-full h-64'}`}
        aria-label="Chargement..."
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !posterUrl) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || 'w-full h-64'}`}
        aria-label={alt}
      >
        <span className="text-gray-400 text-sm">Affiche non disponible</span>
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={alt}
      className={`object-cover ${className || 'w-full h-64'}`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

export default MoviePoster;
