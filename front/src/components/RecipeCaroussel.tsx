/*
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RecipeImage from "./RecipeImage";
import MovieImage from "./MovieImage";
import { Recipe } from "../types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

interface RecipeCarouselProps {
  recipes: Recipe[];
  activeSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({
  recipes,
  activeSlide,
  onPrevSlide,
  onNextSlide,
}) => {
  if (!recipes.length) return null;

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 text-secondary p-2 rounded-full shadow-lg hover:bg-white hover:text-secondary transition-all"
        onClick={onClick}
      >
        <ChevronRight className="h-6 w-6" />
      </div>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 text-secondary p-2 rounded-full shadow-lg hover:bg-white hover:text-secondary transition-all"
        onClick={onClick}
      >
        <ChevronLeft className="h-6 w-6" />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: activeSlide,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: number, newIndex: number) => {
      if (newIndex > activeSlide) {
        onNextSlide();
      } else {
        onPrevSlide();
      }
    },
  };
  // Fonction pour gérer la navigation vers la page d'un film
  const handleMovieClick = (e: React.MouseEvent<HTMLDivElement>, movieId: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/films/${movieId}`;
  };

  return (
    <div className="recipe-carousel relative">
      <Slider {...settings}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="focus:outline-none cursor-pointer">
            <Link to={`/recettes/${recipe.id}`} className="block">
              <div className="flex border border-gray-200 h-[320px] hover:shadow-lg transition-shadow">
                <div className="w-[70%] relative overflow-hidden">
                  <RecipeImage
                    recipe={recipe}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="w-[30%] relative overflow-hidden bg-gray-100">
                  {recipe.movie && (
                    <div 
                      onClick={(e) => recipe.movie?.id && handleMovieClick(e, recipe.movie.id)} 
                      className="w-full h-full cursor-pointer"
                    >
                      <MovieImage
                        movie={recipe.movie}
                        alt={recipe.movie.title || ''}
                        className="w-full h-full object-contain bg-black transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="font-medium text-sm">{recipe.title}</p>
                {recipe.movie && (
                  <p className="text-xs text-gray-500 mt-1">
                    Inspiré par: {recipe.movie.title}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecipeCarousel;
*/