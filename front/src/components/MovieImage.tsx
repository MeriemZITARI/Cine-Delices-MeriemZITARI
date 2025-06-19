import React, { useState, useEffect } from "react";
import MovieImageService from "../services/movieImageService";
import placeholderImg from "/images/placeholder.jpg?url";

interface MovieImageProps {
  movie: {
    id: string;
    title: string;
    year?: string;
    poster?: string;
  };
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
const getFullImagePath = (path: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  return fullPath;
};

const MovieImage: React.FC<MovieImageProps> = ({ movie, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMovieImage = async () => {
      if (!movie || !movie.title) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        if (movie.poster) {
          const fullPath = getFullImagePath(movie.poster);
          if (fullPath) {
            setImageUrl(fullPath);
            return;
          }
        }
        const id = extractImdbId(movie.imdbLink);

        const posterUrl = await MovieImageService.getMoviePosterByTitle(
          movie.title,
          movie.year,
          id
        );
        if (posterUrl) {
          const fullPath = getFullImagePath(posterUrl);
          setImageUrl(fullPath);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadMovieImage();
  }, [movie]);

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