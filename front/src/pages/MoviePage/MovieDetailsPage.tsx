import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IMovie } from "../../types/Movies";
import type { IRecipe } from "../../types/Recipe";
import MovieImage from "../../components/MovieImage";
import RecipeCard from "../../components/RecipeCard";
import { useMovieById } from "../../hooks/query/movie"; 

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading, isError } = useMovieById(id || '');
{/*console.log('🧐 Description du film :', movie?.description);

if (movie?.description && /<\/?[a-z][\s\S]*>/i.test(movie.description)) {
  console.log('⚠️ movie.description contient potentiellement du HTML');
} else {
  console.log('✅ movie.description semble être du texte brut');
}*/}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen"  role="status" 
      aria-live="polite"
      aria-busy="true">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-4">Film introuvable</p>
          <button
            onClick={() => navigate("/films")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retourner aux films
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* En-tête du film */}
      <header className="bg-customYellow py-8" role="banner">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">{movie.title}</h1>
        </div>
      </header>

      {/* Détails du film */}
      <article className="container mx-auto max-w-4xl p-4" aria-labelledby="movie-title">
        <section className="bg-white rounded-lg shadow-md p-4">
          <div className="w-full h-64 flex items-center justify-center rounded-md mb-4" role="img" aria-label={`Image du film ${movie.title}`}>
            <MovieImage
              movie={movie}
              alt={movie.title}
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
          <p className="text-gray-600 mb-4">{movie.description}</p>
          <p className="text-gray-600 mb-4">
            <strong>Date de sortie :</strong>{" "}
            {new Date(movie.releaseDate).toLocaleDateString("fr-FR")}
          </p>
          <p className="text-gray-600">
            <strong>IMDB :</strong>{" "}
            <a
              href={movie.imdbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              aria-label={`Voir le film ${movie.title} sur IMDB (ouvre dans un nouvel onglet)`}
            >
              Voir sur IMDB
            </a>
          </p>
        </section>
      </article>

      {/* Recettes associées */}
      <section className="container mx-auto p-4" aria-labelledby="recipes-title">
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
            <p className="text-center text-gray-600">
              Aucune recette associée à ce film.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default MovieDetailPage;
