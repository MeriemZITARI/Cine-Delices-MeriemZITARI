import React, { useEffect, useState } from 'react';
import { IRecipe } from '../../types/Recipe';
import Button from '../Button/Button';
import { useUpdateRecipeAsAdmin } from '../../hooks/query/admin/adminRecipe';
import { ICategory } from '../../types/category';
//import { IIngredient } from '../../types/ingredient';
import {Ingredient} from '../../hooks/query/ingredient';

// 

interface EditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: IRecipe;
  allCategories: ICategory[];
  allIngredients: Ingredient[];
}

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  allCategories,
  allIngredients,
}) => {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [quote, setQuote] = useState(recipe.quote || '');
  const [categoryId, setCategoryId] = useState(recipe.category.id);
  const [isValidated, setIsValidated] = useState(recipe.isValidated);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [ingredients, setIngredients] = useState(
    recipe.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      quantity: i.quantity,
      unit: i.unit,
    }))
  );

  const updateRecipeMutation = useUpdateRecipeAsAdmin();

  useEffect(() => {
    if (isOpen) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setQuote(recipe.quote || '');
      setCategoryId(recipe.category.id);
      setIsValidated(recipe.isValidated);
      setImageFile(null);
      setIngredients(
        recipe.ingredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
          unit: i.unit,
        }))
      );
    }
  }, [isOpen, recipe]);

  const handleIngredientChange = (index: number, key: string, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [key]: value };
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('quote', quote);
    formData.append('categoryId', categoryId);
    formData.append('isValidated', String(isValidated));
    if (imageFile) formData.append('image', imageFile);
    formData.append('ingredients', JSON.stringify(ingredients));

    try {
      await updateRecipeMutation.mutateAsync({
        recipeId: recipe.id,
        updateData:formData,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Modifier la recette (admin)</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Titre :
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>
          <label className="block mb-2">
            Description :
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>
          <label className="block mb-2">
            Anecdote :
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>
          <label className="block mb-2">
            Catégorie :
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border rounded px-3 py-2 bg-white">
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <fieldset className="mb-2">
            <legend className="text-sm font-medium">Ingrédients :</legend>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <select
                  value={ing.ingredientId}
                  onChange={(e) => handleIngredientChange(idx, 'ingredientId', e.target.value)}
                  className="flex-1 border px-2 py-1"
                >
                  {allIngredients.map((ingr) => (
                    <option key={ingr.id} value={ingr.id}>{ingr.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantité"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', parseFloat(e.target.value))}
                  className="w-20 border px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="Unité"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                  className="w-24 border px-2 py-1"
                />
              </div>
            ))}
          </fieldset>
          <label className="block mb-2">
            Image :
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={isValidated} onChange={(e) => setIsValidated(e.target.checked)} />
            Validée
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" text="Annuler" className="bg-gray-500" onClick={onClose} />
            <Button type="submit" text="Enregistrer" disabled={updateRecipeMutation.isPending} />
          </div>
          {updateRecipeMutation.isError && (
            <p className="text-red-500 mt-2">{(updateRecipeMutation.error as Error).message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
