import React, { useState, useEffect } from "react";
import RecipeImageService from "../services/recipeImageService";
import placeholderImg from "/images/placeholder.jpg?url";

interface RecipeImageProps {
  recipe: {
    id: string;
    title: string;
    image?: string;
  };
  alt: string;
  className?: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({
  recipe,
  alt,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!recipe || !recipe.title) {
      setError(true);
      setLoading(false);
      return;
    }
    try {
      let url;
      if (recipe.image && recipe.image.startsWith("http")) {
        url = recipe.image;
      } else {
        url = RecipeImageService.getRecipeImage(recipe.title);
      }
      setImageUrl(url);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, [recipe]);

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
    <img src={imageUrl} alt={alt || recipe.title} className={className || ""} />
    // <div className={`relative ${className || ""}`}>
    //   <img
    //     src={imageUrl}
    //     alt={alt || recipe.title}
    //     className="w-full h-full object-cover"
    //   />
    //   <div className="absolute inset-0 bg-white bg-opacity-40"></div>
    // </div>
  );
};

export default RecipeImage;