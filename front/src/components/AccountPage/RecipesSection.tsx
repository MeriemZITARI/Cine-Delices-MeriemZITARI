// Imports inchangés
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaClock, FaTools } from 'react-icons/fa';
import { IRecipe } from '../../types/Recipe';
import getDifficultyText from '../../utils/getDifficulty';
import RecipeImage from '../RecipeImage';
import Button from '../Button/Button';
//import { Button } from '../../components/ui/button';
import { useUserRecipes, useUpdateRecipe, useDeleteRecipe } from '../../hooks/query/account';
import DeleteRecipeModal from './DeleteRecipeModal';
import { useIngredients } from '../../hooks/query/ingredient';

interface RecipeIngredient {
  id?: string;
  ingredientName?: string;
  quantity: number;
  unit: string;
}

const RecipesSection: React.FC = () => {
  // Récupération des recettes de l'utilisateur
  const { data: recipes = [], isLoading, isError, error } = useUserRecipes();
  // Récupération des ingrédients pour le formulaire de modification
  const { data: ingredients = [] } = useIngredients();
  // Mutations pour mettre à jour et supprimer les recettes
  const updateRecipeMutation = useUpdateRecipe();
  // Mutation pour supprimer une recette
  const deleteRecipeMutation = useDeleteRecipe();
  // États pour gérer la sélection de la recette, le modal et les ingrédients
  //const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localRecipe, setLocalRecipe] = useState<IRecipe | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // États pour gérer les ingrédients sélectionnés dans le formulaire
  //const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [unitInput, setUnitInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  // État pour gérer le modal de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openModal = (recipe: IRecipe) => {
    //setSelectedRecipe(recipe);
    setLocalRecipe(recipe);
    //setSelectedIngredientIds(recipe.ingredients?.map((i) => i.ingredientId) || []);
    setSelectedIngredients (recipe.ingredients?.map((i) => ({
      id: i.ingredientId,
      ingredientName: i.ingredient.name,
      quantity: i.quantity,
      unit: i.unit
    })) || [])
    console.log("Selected Ingredients:", recipe);

    setNewImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    //setSelectedRecipe(null);
    setLocalRecipe(null);
    setNewImage(null);
    //setSelectedIngredientIds([]);
    setSelectedIngredients([]);
    closeDeleteModal();
  };

  const openDeleteModalForRecipe = (recipe: IRecipe) => {
    setLocalRecipe(recipe);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleUpdateRecipe = async () => {
    if (!localRecipe) return;

    try {
      const formData = new FormData();
      formData.append('title', localRecipe.title);
      formData.append('description', localRecipe.description);
      formData.append('categoryId', String(localRecipe.category.id));
      
     
      formData.append('duration', String(localRecipe.duration));
      formData.append('difficulty', String(localRecipe.difficulty));
      formData.append('quote', localRecipe.quote || '');

     /* selectedIngredientIds.forEach((id) =>
        formData.append('ingredientIds', String(id))
      );*/

      /*selectedIngredients.forEach((ing, index) => {
        formData.append(`ingredients[${index}][quantity]`, String(Number(ing.quantity)));
  formData.append(`ingredients[${index}][unit]`, ing.unit);
  
  if (ing.id ) {
    formData.append(`ingredients[${index}][ingredientId]`, ing.id);
  } else if (!ing.id && ing.ingredientName) {
    formData.append(`ingredients[${index}][ingredientName]`, ing.ingredientName);
  } else {
    console.warn("Ingrédient invalide : nécessite un id OU un nom.");
  }
      });*/

      const ingredients = selectedIngredients.map((ing) => {
        const base = {
          quantity: Number(ing.quantity), // assure qu'on envoie bien un nombre
          unit: ing.unit,
        };
      
        if (ing.id) {
          return { ...base, ingredientId: ing.id };
        } else if (ing.ingredientName) {
          return { ...base, ingredientName: ing.ingredientName };
        } else {
          console.warn("Ingrédient invalide : nécessite un id OU un nom.");
          return null;
        }
      }).filter(Boolean); // retire les null
      
      formData.append('ingredients', JSON.stringify(ingredients));
      

     if (newImage) {
        formData.append('image', newImage);
      }
      // Log des données avant l'envoi pour débogage
console.log('FormData avant envoi :', Array.from(formData.entries()));

      updateRecipeMutation.mutate({ id: localRecipe.id, data: formData });
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

  // Suggestions d'ingrédients filtrées
  const ingredientSuggestions = ingredientInput && showSuggestions
    ? ingredients.filter(i =>
        i.name.toLowerCase().includes(ingredientInput.toLowerCase())
      )
    : [];
// Ajouter un ingrédient à la liste sélectionnée
const handleAddIngredient = (name: string) => {
  if (!name.trim()) return;
  const quantityNumber = Number(quantityInput);
  if (isNaN(quantityNumber) || quantityNumber <= 0) return;

  const existingIngredient = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());

  setSelectedIngredients([
    ...selectedIngredients,
    {
      id: existingIngredient?.id,
      ingredientName: name,
      quantity: quantityNumber,
      unit: unitInput
    }
  ]);

  setIngredientInput("");
  setQuantityInput("");
  setUnitInput("");
  setShowSuggestions(true);
};

// Supprimer un ingrédient sélectionné
const handleRemoveIngredient = (index: number) => {
  setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
};

  if (isLoading) return <p className="text-gray-500 text-sm mt-2">Chargement des recettes...</p>;
  if (isError) return <p className="text-red-500 font-bold mt-6">{(error as Error).message}</p>;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => openModal(recipe)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg cursor-pointer text-white hover:text-customYellow w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-[19%]"
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
                  <span className="text-customYellow"><FaClock /></span>
                  {recipe.duration} min
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-customYellow"><FaTools /></span>
                  {getDifficultyText(recipe.difficulty)}
                </span>
              </div>

              {/* Badge validation */}
      {!recipe.isValidated ? (
        <div
          className="absolute bottom-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10"
          title="Recette en cours de validation"
        >
          ❌
        </div>
      ) : (
        <div
          className="absolute bottom-2 right-2 text-green-500 text-sm z-10"
          title="Recette validée"
        >
          ✔️
        </div>
      )}

              
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && localRecipe &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-start justify-center px-4 py-10">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">Modifier la recette</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateRecipe(); }}>
                {/* Champs texte standard */}
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
                  <label className="block text-sm font-medium mb-1">Description</label>
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
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewImage(e.target.files[0]);
                      }
                    }}
                    className="w-full"
                  />
                </div>

                {/*<div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Ingrédients</label>
                  <select
                    multiple
                    value={selectedIngredientIds.map(String)}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                      console.log('SelectedOptions', selectedOptions);
                      setSelectedIngredientIds(selectedOptions);
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white h-32"
                  >
                    {localRecipe.ingredients.map((ingredient) => (
                      <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
                        {ingredient.ingredient.name}
                      </option>
                    ))}
                  </select>
                </div>*/}

                        {/* Ingrédients */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Ingrédients</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Ajouter un ingrédient"
              value={ingredientInput}
              onChange={e => {
                setIngredientInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // délai pour pouvoir cliquer sur suggestion
            />
            <input
              type="number"
              min={0}
              className="w-20 border rounded px-3 py-2"
              placeholder="Quantité"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
            />
            <input
              className="w-20 border rounded px-3 py-2"
              placeholder="Unité"
              value={unitInput}
              onChange={e => setUnitInput(e.target.value)}
            />
            <Button
              text ="+"
              type="button"
              disabled={!ingredientInput || !quantityInput || !unitInput}
              onClick={() => handleAddIngredient(ingredientInput)}
            />
            
          </div>

          {/* Suggestions ingrédients */}
          {showSuggestions && ingredientSuggestions.length > 0 && (
            <ul className="border rounded max-h-40 overflow-y-auto bg-white">
              {ingredientSuggestions.map((i) => (
                <li
                  key={i.id}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                  onMouseDown={() => {
                    handleAddIngredient(i.name);
                    setShowSuggestions(false);
                  }}
                >
                  {i.name}
                </li>
              ))}
            </ul>
          )}

          {/* Liste ingrédients sélectionnés */}
          <ul className="mt-2">
            {selectedIngredients.map((ing, index) => (
              <li key={index} className="flex justify-between items-center py-1 border-b">
                <span>{`${ing.ingredientName || ""} - ${ing.quantity} ${ing.unit}`}</span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Temps de préparation</label>
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
                    value={localRecipe.quote}
                    onChange={(e) =>
                      setLocalRecipe({ ...localRecipe, quote: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4">
                  <Button text="Annuler" className="bg-gray-500 hover:bg-gray-700 flex-1" onClick={closeModal} type="button" />
                  <Button text={updateRecipeMutation.isPending ? "Enregistrement..." : "Enregistrer"} className="flex-1" type="submit" disabled={updateRecipeMutation.isPending} />
                  <Button text="Supprimer" className="bg-red-600 hover:bg-red-800 flex-1" type="button" onClick={() => openDeleteModalForRecipe(localRecipe)} disabled={deleteRecipeMutation.isPending} />
                </div>
              </form>

              {updateRecipeMutation.isError && (
                <p className="text-red-500 mt-2">{(updateRecipeMutation.error as Error).message}</p>
              )}
            </div>
            </div>
          </div>,
          document.getElementById('modal-root') as HTMLElement
        )
      }

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
