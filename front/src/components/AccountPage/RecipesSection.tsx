import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useEffect, useState } from 'react';
import userService from '../../services/api/UserServices';
import { IRecipe } from '../../types/Recipe';

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
          console.log(response);
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
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-black">Mes recettes</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <ul className="mt-4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="text-gray-700 text-sm">
              {recipe.title}
            </li>
          ))}
        </ul>
      </div>
    );
};

export default RecipesSection;