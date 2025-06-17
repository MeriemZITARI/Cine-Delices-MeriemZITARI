import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useEffect, useState } from 'react';
import userService from '../../services/api/UserServices';

const RecipesSection : React.FC = () => {
    // Utilisation de l'atome pour gérer l'utilisateur connecté
    const [authUser, setAuthUser] = useAtom(authUserAtom);
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchRecipes = async () => {
        /*const response = await userService.getUserRecipes();
        if (response.success) {
          setRecipes(response.recipes);
        } else {
          setError(response.message);
        }*/
      };
  
      fetchRecipes();
    }, [authUser]);
    
    return (
        <h2 className="text-lg sm:text-2xl font-bold text-black">Mes recettes</h2>
        /*{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <ul className="mt-4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="text-gray-700 text-sm">
              {recipe.title}
            </li>
          ))}
        </ul>*/
    );
};

export default RecipesSection;