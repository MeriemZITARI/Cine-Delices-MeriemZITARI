import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useEffect, useState } from 'react';
import userService from '../../services/api/UserServices';
import { IRecipe } from '../../types/Recipe';
import getDifficultyText from '../../utils/getDifficulty';
import RecipeImage from '../RecipeImage';
import { FaClock, FaTools } from 'react-icons/fa';
import Button from '../Button/Button';
import ReactDOM from 'react-dom';
import recipeService from '../../services/api/RecipeService';

const RecipesSection : React.FC = () => {
  // Utilisation de l'atome pour gérer l'utilisateur connecté
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  // États pour gérer les recettes et les erreurs
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gestion de la modification d'une recette
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleUpdateRecipe = async () => {
    if (!selectedRecipe) return;

    try {
      const response = await recipeService.updateRecipe(selectedRecipe.id, {
        title: selectedRecipe.title,
        description: selectedRecipe.description,
        duration: selectedRecipe.duration,
        difficulty: selectedRecipe.difficulty,
        quote: selectedRecipe.quote,
      });
      
      if (response.success) {
        // Met à jour la liste des recettes sur la page
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            // Si la recette correspond à celle sélectionnée, on met à jour ses informations
            recipe.id === selectedRecipe.id ? { ...recipe, ...selectedRecipe } : recipe
          )
        );
        setIsModalOpen(false);
      } else {
        setError("Échec de la mise à jour de la recette.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour de la recette.");
    }
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!authUser?.id) {
        setError("Utilisateur non authentifié.");
        return;
      }

      setLoading(true);
      try {
        const response = await userService.getUserRecipes();
        console.log("Réponse de getUserRecipes:", response);
        if (!response || !response.success) {
          throw new Error("Échec de la modification du mot de passe.");
        }

        setRecipes(response.recipes);

      } catch (err) {
        setError("Une erreur est survenue lors de la récupération des recettes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [authUser]);
  
  return (
    <>
      {loading && <p className="text-gray-500 text-sm mt-2">Chargement des recettes...</p>}
      <div className="flex flex-col md:flex-row gap-4">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            onClick={() => openModal(recipe)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg flex-1 cursor-pointer text-white hover:text-customYellow"
          >
            <div className="relative h-48">
              {/* Image de la recette */}
              <RecipeImage
                recipe={recipe}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
    
              {/* Titre en haut à gauche avec fond grisé transparent (de haut en bas) */}
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-gray-800/70 to-transparent p-2">
                <h3 className="font-bold text-xl break-words leading-tight">{recipe.title}</h3>
              </div>
    
              {/* Temps + difficulté en bas à gauche avec fond noir dégradé */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col gap-1 text-xs font-bold">
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
          </div>
        ))}

        {/* Modale */}
        {isModalOpen && selectedRecipe && 
          ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Modifier la recette</h2>
                <form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                      type="text"
                      value={selectedRecipe.title}
                      onChange={(e) =>
                        setSelectedRecipe({ ...selectedRecipe, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Instructions</label>
                    <textarea
                      value={selectedRecipe.description}
                      onChange={(e) =>
                        setSelectedRecipe({
                          ...selectedRecipe,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Temps de préparation (en minutes)</label>
                    <input
                      type="number"
                      value={selectedRecipe.duration}
                      onChange={(e) =>
                        setSelectedRecipe({
                          ...selectedRecipe,
                          duration: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Difficulté</label>
                    <select
                      value={selectedRecipe.difficulty}
                      onChange={(e) =>
                        setSelectedRecipe({
                          ...selectedRecipe,
                          difficulty: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {getDifficultyText(difficulty)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Citation de film</label>
                    <textarea
                      value={selectedRecipe.quote}
                      onChange={(e) =>
                        setSelectedRecipe({
                          ...selectedRecipe,
                          quote: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      text="Annuler"
                      className="bg-gray-500 hover:bg-gray-700 flex-1"
                      onClick={() => setIsModalOpen(false)}
                    />
                    <Button
                      text="Enregistrer"
                      className="flex-1"
                      onClick={handleUpdateRecipe}
                    />
                  </div>
                </form>
              </div>
            </div>
          ,
          document.getElementById('modal-root') as HTMLElement
          // Rend la modale dans le conteneur #modal-root à la racine de l'application
        )}
      </div>
      {error && <p className="text-red-500 font-bold mt-6">{error}</p>}
    </>
  );
};

export default RecipesSection;