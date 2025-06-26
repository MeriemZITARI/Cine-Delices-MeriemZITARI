import React from "react";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  imageUrl,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <Link
          to={`/recettes/${id}`}
          className="text-blue-500 hover:underline"
        >
          Voir la recette
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;