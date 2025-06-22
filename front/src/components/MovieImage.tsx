import React, { useState, useEffect } from "react";
import placeholderImg from "/images/placeholder.jpg?url";
import { IMovie } from "../types/Movies";

interface MovieImageProps {
  movie: IMovie; // Contient `moviedbId` ou `imdbLink`
  alt?: string;
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

const MovieImage: React.FC<MovieImageProps> = ({ movie, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
  const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    const loadMovieImage = async () => {
      if (!movie || (!movie.moviedbId && !movie.imdbLink)) {
        console.error("Aucun ID valide trouvé pour le film.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        let url = "";
        let responseData = null;

        // Utiliser TMDB si `moviedbId` est présent
        if (movie.moviedbId) {
          if (!tmdbApiKey) {
            console.error("Clé API TMDB manquante.");
            setError(true);
            setLoading(false);
            return;
          }
          url = `https://api.themoviedb.org/3/movie/${movie.moviedbId}?api_key=${tmdbApiKey}&language=fr-FR`;
          const response = await fetch(url);
          if (response.ok) {
            responseData = await response.json();
            if (responseData.poster_path) {
              setImageUrl(`https://image.tmdb.org/t/p/w500${responseData.poster_path}`);
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        } 
        // Utiliser OMDb si `imdbLink` est présent
        else if (movie.imdbLink) {
          const imdbId = extractImdbId(movie.imdbLink);
          if (!imdbId || !omdbApiKey) {
            console.error("Clé API OMDb manquante ou ID IMDb invalide.");
            setError(true);
            setLoading(false);
            return;
          }
          url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`;
          const response = await fetch(url);
          if (response.ok) {
            responseData = await response.json();
            if (responseData.Poster && responseData.Poster !== "N/A") {
              setImageUrl(responseData.Poster);
            } else {
              setError(true);
            }
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

    loadMovieImage();
  }, [movie, tmdbApiKey, omdbApiKey]);

  if (loading) {
    return (
      <div
        className={`${
          className || ""
        } bg-gray-200 flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <img
        src={placeholderImg}
        alt={alt || "Image non disponible"}
        className={className || ""}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || movie.title}
      className={className || ""}
      onError={() => setError(true)}
    />
  );
};

export default MovieImage;
