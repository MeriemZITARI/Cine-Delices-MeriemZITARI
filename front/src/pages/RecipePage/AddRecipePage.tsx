import React, { useState } from "react";
import MovieSearchModal from '../../components/MovieSearchModal';
import { useIngredients } from '../../hooks/query/ingredient';
import { useCategories } from '../../hooks/query/category';
import { useCreateRecipe } from '../../hooks/query/recipe';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

interface RecipeIngredient {
  id?: string;
  ingredientName?: string;
  quantity: number;
  unit: string;
}

const AddRecipePage: React.FC = () => {
  const navigate = useNavigate();

  // États formulaire
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [unitInput, setUnitInput] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [servings, setServings] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [movieDescription, setMovieDescription] = useState("");

  // React Query hooks
  const { data: ingredients = [], isLoading: loadingIngredients, error: errorIngredients } = useIngredients();
  const { data: categories = [], isLoading: loadingCategories, error: errorCategories } = useCategories();
  const createRecipeMutation = useCreateRecipe();

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
    if (!unitInput.trim()) return;
    
    // Vérifier si l'ingrédient existe déjà dans la BDD
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
    console.log("Ingrédient ajouté :", {
      id: existingIngredient?.id,
      ingredientName: name,
      quantity: quantityNumber,
      unit: unitInput
    });

    setIngredientInput("");
    setQuantityInput("");
    setUnitInput("");
    setShowSuggestions(true);
  };

  // Supprimer un ingrédient sélectionné
  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      alert("Une image au format .webp est requise.");
      return;
    }

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", desc);
    formData.append("categoryId", category);
    if (selectedMovie?.id != null && selectedMovie.id !== "") {
      const parsedId = Number(selectedMovie.id);
      if (!isNaN(parsedId)) {
        formData.append("moviedbId", parsedId.toString());
      }
    }
    formData.append("duration", String(Number(duration)));
    formData.append("difficulty", String(Number(difficulty)));
    formData.append("servings", String(Number(servings)));
    formData.append("quote", movieDescription);

    selectedIngredients.forEach((ing, index) => {
      formData.append(`ingredients[${index}][quantity]`, String(Number(ing.quantity)));
formData.append(`ingredients[${index}][unit]`, ing.unit);

if (ing.id ) {
  formData.append(`ingredients[${index}][ingredientId]`, ing.id);
} else if (!ing.id && ing.ingredientName) {
  formData.append(`ingredients[${index}][ingredientName]`, ing.ingredientName);
} else {
  console.warn("Ingrédient invalide : nécessite un id OU un nom.");
}
    });

    formData.append("image", image);
      // Log des données avant l'envoi pour débogage
      console.log('FormData avant envoi :', Array.from(formData.entries()));
    createRecipeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Recette créée avec succès ! Elle est en attente de validation.", {
          duration: 7000,
          position: "top-center",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });
        navigate('/recettes');
      },
      onError: () => {
        alert("Erreur lors de la création de la recette.");
      }
    });
  };

  // Gestion changement image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "image/webp") {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
      if (file) alert("Veuillez sélectionner une image au format .webp");
    }
  };

  // Sélection d’un film
  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setShowMovieSearch(false);
  };

  // Annuler l’ajout
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 py-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Ajouter une nouvelle recette</h2>

      <form onSubmit={handleSubmit}>

        {/* Titre et durée */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Titre de la recette"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            min={0}
            className="w-32 border rounded px-3 py-2"
            placeholder="Durée (minutes)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        {/* Description */}
        <textarea
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Description"
          rows={3}
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        {/* Difficulté et nombre de personnes */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <select
            className="flex-1 border rounded px-3 py-2"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            required
          >
            <option value="">Difficulté</option>
            <option value="1">1 - Très facile</option>
            <option value="2">2 - Facile</option>
            <option value="3">3 - Intermédiaire</option>
            <option value="4">4 - Confirmé </option>
            <option value="5">5 - Difficile</option>
          </select>

          <input
            type="number"
            min={1}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Nombre de personnes"
            value={servings}
            onChange={e => setServings(e.target.value)}
            required
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Image (.webp uniquement)</label>
          <input type="file" accept="image/webp" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-2 max-h-40 max-w-full rounded" />}
        </div>

        {/* Citation */}
        <input
          type="text"
          placeholder="Citation (optionnel)"
          className="w-full border rounded px-3 py-2 mb-4"
          value={movieDescription}
          onChange={e => setMovieDescription(e.target.value)}
        />

        {/* Ingrédients */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Ingrédients</label>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_auto] gap-2 mb-2 items-center">
            <input
              className="border rounded px-3 py-2 w-full"
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
              className="w-1/3 min-w-[70px] border rounded px-3 py-2"
              placeholder="Quantité"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Unité"
              value={unitInput}
              onChange={e => setUnitInput(e.target.value)}
            />
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={!ingredientInput || !quantityInput || !unitInput}
              onClick={() => handleAddIngredient(ingredientInput)}
            >
              +
            </Button>
          </div>

          {/* Suggestions ingrédients */}
          {showSuggestions && ingredientSuggestions.length > 0 && (
            <ul className="border rounded max-h-40 overflow-y-auto bg-white">
              {ingredientSuggestions.map((i) => (
                <li
                  key={i.id}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                  onMouseDown={() => {
                    //handleAddIngredient(i.name);
                    setIngredientInput(i.name);
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

        {/* Catégorie */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Catégorie</label>
          {loadingCategories && <p>Chargement des catégories...</p>}
          {errorCategories && <p>Erreur chargement catégories</p>}
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Film lié */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Film lié (optionnel)</label>
          <Button type="button" onClick={() => setShowMovieSearch(true)}> Rechercher un film</Button>
          {selectedMovie && (
            <div className="mt-2 p-2 border rounded flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {selectedMovie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="rounded"
                />
              )}
              <div>
                <p className="font-semibold">{selectedMovie.title}</p>
                <button
                  type="button"
                  className="text-red-500 text-sm"
                  onClick={() => setSelectedMovie(null)}
                >
                  Supprimer la sélection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" disabled={createRecipeMutation.isPending}>
           {createRecipeMutation.isPending ? "Enregistrement..." : "Ajouter la recette"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
          Annuler
          </Button>
        </div>
      </form>

      {showMovieSearch && (
        <MovieSearchModal
          onSelect={handleMovieSelect}
          onClose={() => setShowMovieSearch(false)}
        />
      )}
    </div>
  );
};

export default AddRecipePage;
