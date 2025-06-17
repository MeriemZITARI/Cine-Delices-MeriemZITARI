import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useEffect, useState } from 'react';
import userService from '../../services/api/UserServices';
import { IRecipe } from '../../types/Recipe';
import getDifficultyText from '../../utils/getDifficulty';
import { Link } from 'react-router-dom';
import RecipeImage from '../RecipeImage';
import { FaClock, FaTools } from 'react-icons/fa';

const RecipesSection : React.FC = () => {
    // Utilisation de l'atome pour gérer l'utilisateur connecté
    const [authUser, setAuthUser] = useAtom(authUserAtom);
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchRecipes = async () => {
        if (!authUser?.id) {
          setError("Utilisateur non authentifié.");
          return;
        }
        
        try {
          const response = await userService.getUserRecipes();
          console.log("Réponse de getUserRecipes:", response);
          if (!response || !response.success) {
            throw new Error("Échec de la modification du mot de passe.");
          }

          setRecipes(response.recipes);

        } catch (err) {
          setError("Une erreur est survenue lors de la récupération des recettes.");
        }
      };
  
      fetchRecipes();
    }, [authUser]);
    
    return (
      <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {recipes.map((recipe) => (
          <Link 
            key={recipe.id} 
            to={`/recettes/${recipe.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            <div className="relative h-48">
              {/* Image de la recette */}
              <RecipeImage
                recipe={recipe}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
    
              {/* Titre en haut à gauche avec fond grisé transparent (de haut en bas) */}
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-gray-800/70 to-transparent text-white p-2">
                <h3 className="font-bold text-sm truncate">{recipe.title}</h3>
              </div>
    
              {/* Temps + difficulté en bas à gauche avec fond noir dégradé */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-2 flex flex-col gap-1 text-xs font-bold">
                <span className="flex items-center gap-2">
                  <span className="text-customYellow">
                    <FaClock />
                  </span>
                  {recipe.duration} min
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-customYellow">
                    <FaTools />
                  </span>
                  {getDifficultyText(recipe.difficulty)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
};

export default RecipesSection;