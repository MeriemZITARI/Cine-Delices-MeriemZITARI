import React from "react";
import RecipeImage from "./RecipeImage";
import MoviePoster from "./MoviePoster"; // Changer l'import

interface MovieForDetail {
  id: string;
  title: string;
  year: string;
  poster?: string;
  imdbLink?: string; // Ajouter cette propriété
}

interface RecipeDetailProps {
  title: string;
  author: string;
  difficulty: string;
  duration: number;
  image: string;
  category: string;
  movie?: MovieForDetail;
  ingredients: string[];
  instructions: string;
  anecdote: string;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  title,
  author,
  difficulty,
  duration,
  image,
  category,
  movie,
  ingredients,
  instructions,
  anecdote,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Bandeau jaune pleine largeur sous le header */}
      <div className="w-full background-gradient-yellow pt-8 sm:pt-10" style={{ paddingBottom: '1cm' }}>
        <div className="w-full max-w-xl lg:max-w-4xl mx-auto">
          {/* Bloc blanc contenant infos et images, sans coins arrondis */}
          <div className="bg-white p-4 shadow-lg lg:p-8 mt-10">
            {/* Bloc titre/difficulté/film/auteur au-dessus des images en desktop */}
            <div className="hidden lg:block mb-4">
              <h1 className="text-2xl font-bold text-center">{title}</h1>
              {movie && (
                <div className="text-center text-sm text-gray-700 mt-1">Inspiré par le film "{movie.title}"</div>
              )}
              <div className="flex justify-center items-center gap-4 mt-2 text-base text-gray-800">
                <span>Difficulté : <span className="font-semibold">{difficulty}</span></span>
                <span className="text-gray-400">|</span>
                <span>Temps : <span className="font-semibold">{duration} min</span></span>
              </div>
              <div className="text-center text-sm text-gray-600 mt-1">par {author}</div>
            </div>
            {/* Bloc infos recette mobile (titre, auteur, difficulté, durée) */}
            <div className="block lg:hidden mb-2">
              <h1 className="text-xl font-bold text-center">{title}</h1>
              <div className="text-center text-sm text-gray-700 mt-1">par {author}</div>
              <div className="flex justify-center items-center gap-4 mt-2 text-base text-gray-800">
                <span>Difficulté : <span className="font-semibold">{difficulty}</span></span>
                <span className="text-gray-400">|</span>
                <span>Temps : <span className="font-semibold">{duration} min</span></span>
              </div>
            </div>
            {/* Bloc images plat/film */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-4">
              {/* Image plat 70% */}
              <div className="w-full lg:w-[70%]">
                <RecipeImage recipe={{ id: title, title, image }} alt={title} className="w-full h-28 lg:h-64 object-cover rounded-md border" />
                {/* Catégorie sous l'image en mobile, style badge */}
                <div className="block lg:hidden text-center mt-2">
                  <span className="text-sm text-gray-700 mr-2">Catégorie :</span>
                  <span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full align-middle" style={{minWidth:'60px'}}>{category}</span>
                </div>
                {/* Bloc film associé mobile, image à droite du texte, titre sous le texte */}
                {movie && (
                  <div className="block lg:hidden mt-4 flex flex-row items-center justify-between gap-2 px-2 w-full max-w-[400px] mx-auto">
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-base font-semibold text-gray-800 leading-tight">Inspiré par le film :</div>
                      <div className="text-sm font-medium text-gray-700 italic truncate max-w-[70vw]">{`"${movie.title}"`}</div>
                    </div>
                    <div className="flex-shrink-0 w-20 h-20 ml-2 rounded overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                      <MoviePoster 
                        imdbLink={movie.imdbLink}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded shadow"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Image film 30% */}
              {movie && (
                <div className="hidden lg:flex w-full lg:w-[30%] items-center justify-center">
                  <MoviePoster 
                    imdbLink={movie.imdbLink}
                    alt={movie.title}
                    className="w-full h-28 lg:h-64 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Ingrédients & Instructions */}
      <div className="w-full max-w-xl lg:max-w-4xl mx-auto relative z-20" style={{ marginTop: '-1cm' }}>
        <div className="bg-white p-4 mb-4 lg:flex lg:gap-8 shadow-none border-none">
          <div className="mb-4 lg:mb-0 lg:w-1/2">
            <h2 className="font-bold text-base mb-1">Ingrédients :</h2>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2">
            <h2 className="font-bold text-base mb-1">Instructions :</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">{instructions}</p>
          </div>
        </div>
      </div>
      {/* Anecdote */}
      <div className="container mx-auto px-4">
        <hr
          className="hidden sm:block border-t-2 border-red-400 border-dotted my-6 sm:my-8"
          style={{
            borderTopStyle: 'dotted',
            borderTopWidth: '4px',
            borderColor: '#f87171',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderImage: 'none',
            borderTop: '4px dotted #f87171',
            height: 0,
            background: 'none',
            margin: 0,
            width: '100%',
            borderSpacing: '16px',
          }}
        />
      </div>
      <div className="mt-0 mb-8 flex justify-center">
        <div className="w-full" style={{maxWidth: 'calc(40rem + 3cm)'}}>
          <div className="font-bold text-base mb-1 px-4 py-2 text-center">
            La petite anecdote du chef
          </div>
          <div className="px-4 py-3 text-sm text-gray-900" style={{background: 'linear-gradient(90deg, #FFD43B 0%, #FFF7AE 100%)', borderRadius: '8px'}}>
            {anecdote}
          </div>
        </div>
      </div>
      {/* Trait rouge au-dessus du footer */}
      <div className="container mx-auto px-4 mt-8">
        <hr className="hidden sm:block border-t-2 border-red-400 my-0" />
      </div>
    </div>
  );
};

export default RecipeDetail;
