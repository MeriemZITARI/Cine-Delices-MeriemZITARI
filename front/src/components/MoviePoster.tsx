import React, { useState, useEffect } from 'react';
import axios from "axios";

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
        
        if (!apiKey) {
          setError(true);
          return;
        }
        if (!id) {
          setError(true);
          return;
        }
        
        const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
        if (response.status !== 200) {
          throw new Error('Erreur réseau lors de la récupération de l\'affiche');
        }
        
        const data = response.data;
        console.log('OMDb API result:', data);
        
        if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          setPosterUrl(data.Poster);
        } else {
          setError(true);
        }
      } catch (err) {
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
        className={`bg-gray-200 flex items-center justify-center ${className || 'w-full h-[320px]'}`}
        aria-label="Chargement..."
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !posterUrl) {
    return (
      <div 
        className={`bg-gray-200 flex flex-col items-center justify-center ${className || 'w-full h-[320px]'}`}
        aria-label={alt}
      >
        <span className="text-gray-400 text-sm">Affiche non disponible</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className || 'w-full h-[320px]'}`}>
      <img
        src={posterUrl}
        alt={alt}
        className={`object-cover ${className || 'w-full h-[320px]'}`}
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
};

// Axios est déjà utilisé pour OMDb API

export default MoviePoster;
