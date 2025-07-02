import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaClock, FaTools } from 'react-icons/fa';
import { IRecipe } from '../../types/Recipe';
import getDifficultyText from '../../utils/getDifficulty';
import RecipeImage from '../RecipeImage';
import Button from '../Button/Button';
import { useUserRecipes, useUpdateRecipe, useDeleteRecipe } from '../../hooks/query/account';
import DeleteRecipeModal from './DeleteRecipeModal';

const RecipesSection: React.FC = () => {
  const { data: recipes = [], isLoading, isError, error } = useUserRecipes();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();

  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localRecipe, setLocalRecipe] = useState<IRecipe | null>(null);

  // State modale suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openModal = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setLocalRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    setLocalRecipe(null);
    closeDeleteModal();
  };

  // Ouvre la modale suppression pour la recette donnée
  const openDeleteModalForRecipe = (recipe: IRecipe) => {
    setLocalRecipe(recipe);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleUpdateRecipe = async () => {
    if (!localRecipe) return;

    try {
      await updateRecipeMutation.mutateAsync({
        id: localRecipe.id,
        data: {
          title: localRecipe.title,
          description: localRecipe.description,
          duration: localRecipe.duration,
          difficulty: localRecipe.difficulty,
          anecdote: localRecipe.anecdote,
        },
      });
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!localRecipe) return;

    try {
      await deleteRecipeMutation.mutateAsync(localRecipe.id);
      closeDeleteModal();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p className="text-gray-500 text-sm mt-2">Chargement des recettes...</p>;
  if (isError) return <p className="text-red-500 font-bold mt-6">{(error as Error).message}</p>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => openModal(recipe)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg flex-1 cursor-pointer text-white hover:text-customYellow"
          >
            <div className="relative h-48">
              <RecipeImage
                recipe={recipe}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-gray-800/70 to-transparent p-2">
                <h3 className="font-bold text-xl break-words leading-tight">{recipe.title}</h3>
              </div>
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
      </div>

      {isModalOpen && localRecipe &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Modifier la recette</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateRecipe(); }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    value={localRecipe.title}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Instructions</label>
                  <textarea
                    value={localRecipe.description}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, description: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Temps de préparation (en minutes)</label>
                  <input
                    type="number"
                    value={localRecipe.duration}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, duration: parseInt(e.target.value, 10) })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Difficulté</label>
                  <select
                    value={localRecipe.difficulty}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, difficulty: parseInt(e.target.value, 10) })
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
                    value={localRecipe.anecdote}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, anecdote: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    text="Annuler"
                    className="bg-gray-500 hover:bg-gray-700 flex-1"
                    onClick={closeModal}
                    type="button"
                  />
                  <Button
                    text={updateRecipeMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                    className="flex-1"
                    type="submit"
                    disabled={updateRecipeMutation.isPending}
                  />
                  <Button
                    text="Supprimer"
                    className="bg-red-600 hover:bg-red-800 flex-1"
                    type="button"
                    onClick={() => openDeleteModalForRecipe(localRecipe!)}  // <-- ouverture modale suppression
                    disabled={deleteRecipeMutation.isPending}
                  />
                </div>
              </form>
              {updateRecipeMutation.isError && (
                <p className="text-red-500 mt-2">
                  {(updateRecipeMutation.error as Error).message}
                </p>
              )}
            </div>
          </div>,
          document.getElementById('modal-root') as HTMLElement
        )
      }

      {/* Modale suppression */}
      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteRecipe}
        isLoading={deleteRecipeMutation.isPending}
        error={deleteRecipeMutation.isError ? (deleteRecipeMutation.error as Error) : null}
        recipeTitle={localRecipe?.title || ''}
      />
    </>
  );
};

export default RecipesSection;
