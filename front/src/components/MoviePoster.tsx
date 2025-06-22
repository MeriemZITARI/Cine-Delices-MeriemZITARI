import React, { useState, useEffect } from 'react';
import axios from "axios";
import { IMovie } from '../types/Movies';

interface MoviePosterProps {
  movie: IMovie;
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

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, className }) => {
  if (!movie) {
    console.error("Le film passé à MoviePoster est undefined.");
    return <div className="text-red-500">Aucune donnée de film disponible</div>;
  }
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Obtenir l'ID soit depuis moviedbId, soit depuis imdbLink
        const id = movie.moviedbId || (movie.imdbLink ? extractImdbId(movie.imdbLink) : null);
        
        if (!id) {
          console.error("Aucun ID trouvé pour le film.");
          setError(true);
          return;
        }
  
        let url = "";
        if (movie.moviedbId) {
          // Utiliser TMDB API si moviedbId existe
          if (!tmdbApiKey) {
            console.error("Clé API TMDB manquante.");
            setError(true);
            return;
          }
          url = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=fr-FR`;
        } else {
          // Utiliser OMDb API sinon
          if (!apiKey) {
            console.error("Clé API OMDb manquante.");
            setError(true);
            return;
          }
          url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;
        }
  
        //console.log(`Requête API : ${url}`);
        const response = await axios.get(url);
  
        if (response.status !== 200) {
          throw new Error("Erreur réseau lors de la récupération de l'affiche");
        }
  
        const data = response.data;
        //console.log("Résultat API :", data);
        
        // Vérifier les données renvoyées par l'API
        if (movie.moviedbId) {
          // TMDB API
          //console.log(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
          if (data.poster_path) {
            setPosterUrl(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
          } else {
            setError(true);
          }
        } else {
          // OMDb API
          //console.log(data.Poster);
          if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
            setPosterUrl(data.Poster);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'affiche :", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPoster();
  }, [movie, tmdbApiKey, apiKey]);

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
        aria-label={movie.title}
      >
        <span className="text-gray-400 text-sm">Affiche non disponible</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className || 'w-full h-[320px]'}`}>
      <img
        src={posterUrl}
        alt={movie.title}
        className={`object-cover ${className || 'w-full h-[320px]'}`}
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
};

// Axios est déjà utilisé pour OMDb API

export default MoviePoster;
