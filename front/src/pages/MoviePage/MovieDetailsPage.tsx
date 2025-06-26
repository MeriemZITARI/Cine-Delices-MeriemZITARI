import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieService from "../../services/api/MovieService"; // Service pour les films
import type { IMovie } from "../../types/Movies";
import type { IRecipe } from "../../types/Recipe";
import MovieImage from "../../components/MovieImage"; // Composant pour afficher l'image du film
import RecipeCard from "../../components/RecipeCard"; // Composant pour afficher les recettes associées

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupérer l'ID du film depuis l'URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("ID du film manquant");
          return;
        }

        // Récupérer les détails du film avec ses recettes associées
        const movieData = await MovieService.getMovie(id);
        console.log("Données du film récupérées :", movieData); // Ajoutez ce log pour vérifier les données

        if (!movieData) {
          setError("Film introuvable");
          return;
        }

        setMovie(movieData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du film :", err);
        setError("Impossible de charger le film");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-4">{error || "Film introuvable"}</p>
          <button
            onClick={() => navigate("/movies")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retourner aux films
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du film */}
      <div className="bg-customYellow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">{movie.title}</h1>
        </div>
      </div>

      {/* Détails du film */}
      <div className="container mx-auto max-w-4xl p-4">
        <div className="bg-white rounded-lg shadow-md p-4">
        <div className="w-full h-64 flex items-center justify-center rounded-md mb-4">
          <MovieImage
            movie={movie}
            alt={movie.title}
            className="w-full h-full object-contain rounded-md"
          />
        </div>
          <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
          <p className="text-gray-600 mb-4">{movie.description}</p>
          <p className="text-gray-600 mb-4">
            <strong>Date de sortie :</strong> {new Date(movie.releaseDate).toLocaleDateString("fr-FR")}
          </p>
          <p className="text-gray-600">
            <strong>IMDB :</strong>{" "}
            <a
              href={movie.imdbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Voir sur IMDB
            </a>
          </p>
        </div>
      </div>

      {/* Recettes associées */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mt-6 mb-4">Recettes associées</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movie.recipes && movie.recipes.length > 0 ? (
            movie.recipes.map((recipe: IRecipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                imageUrl={recipe.image || "/images/placeholder.jpg"}
                description={recipe.description}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">Aucune recette associée à ce film.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;