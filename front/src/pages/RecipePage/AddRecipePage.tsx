import React, { useState, useEffect } from "react";
import MovieSearchModal from '../../components/MovieSearchModal';
import { getIngredients, addIngredient } from '../../services/api/IngredientService';
import { Button } from '../../components/ui/button';
import { getImageUrl } from '../../services/Tmdb.Api';
import { getCategories, Category } from "../../services/api/CategoryService";
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/api/RecipeService';

interface Ingredient {
  id: string;
  name: string;
}

interface RecipeIngredient {
  id?: string;
  ingredientName?: string; // Changé de name à ingredientName
  quantity: number;
  unit: string;
}

interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  // ...autres champs si besoin...
}

const AddRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("");
  const [unitInput, setUnitInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [servings, setServings] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [duration, setDuration] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [movieDescription, setMovieDescription] = useState<string>("");

  // Ajoutez cet état pour gérer l'édition d'un ingrédient
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getIngredients().then(setIngredients);
  }, []);

  useEffect(() => {
    // Appel à l'API pour charger les catégories depuis CategoryService
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const ingredientSuggestions: Ingredient[] = ingredientInput && showSuggestions
    ? ingredients.filter(i =>
        i.name.toLowerCase().includes(ingredientInput.toLowerCase())
      )
    : [];

  const handleAddIngredient = (name: string) => {
    if (!name.trim()) return;
    const quantityNumber = Number(quantityInput);
    if (isNaN(quantityNumber) || quantityNumber <= 0) return;

    const existingIngredient = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());

    setSelectedIngredients([
      ...selectedIngredients,
      {
        id: existingIngredient?.id,
        ingredientName: name, // Changé de name à ingredientName
        quantity: quantityNumber,
        unit: unitInput
      }
    ]);
    
    setIngredientInput("");
    setQuantityInput("");
    setUnitInput("");
    setShowSuggestions(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const recipeData = {
        title: name,
        description: desc,
        ingredients: selectedIngredients.map(ing => ({
          ...(ing.id ? { ingredientId: ing.id } : { ingredientName: ing.ingredientName }), // Modifié pour utiliser ingredientName
          quantity: ing.quantity,
          unit: ing.unit
        })),
        categoryId: category,
        movieId: selectedMovie?.id.toString(), // Conversion en string
        duration: parseInt(duration),
        difficulty: parseInt(difficulty),
        servings: parseInt(servings),
        image: image ? `http://localhost:3001/uploads/${image.name}` : null, // Ajout de l'URL complète
        quote: movieDescription
      };

      const response = await recipeService.createRecipe(recipeData);
      
      if (response.success) {
        setMessage("Recette créée avec succès !");
        navigate('/recipes'); // Redirection vers la liste des recettes
      } else {
        setMessage("Erreur lors de la création de la recette.");
      }
    } catch (err: any) {
      console.error('Erreur lors de la création de la recette:', err);
      setMessage("Erreur lors de la création de la recette.");
    }
    setLoading(false);
  };

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
      if (file) {
        alert("Veuillez sélectionner une image au format .webp");
      }
    }
  };

  // Handler pour la sélection d'un film
  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setShowMovieSearch(false);
  };

  const handleCancel = () => {
    navigate(-1); // Retourne à la page précédente
  };

  return (
    <div className="w-full max-w-full md:max-w-3xl lg:max-w-4xl mx-auto mt-6 bg-white rounded-xl shadow p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Ajouter une nouvelle recette</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Titre de la recette</label>
              <input
                className="form-control w-full border border-gray-300 rounded px-3 py-2"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block font-semibold mb-1">Durée (en minutes)</label>
              <input
                type="number"
                min="0"
                className="form-control w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Ex : 45"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
          />
        </div>
        {/* Difficulté et Nombre de personnes sur la même ligne en desktop */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Difficulté</label>
              <select
                className="form-control w-full border border-gray-300 rounded px-3 py-2"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                required
              >
                <option value="">Choisir...</option>
                <option value="1">1 - Très facile</option>
                <option value="2">2</option>
                <option value="3">3 - Moyen</option>
                <option value="4">4</option>
                <option value="5">5 - Difficile</option>
              </select>
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block font-semibold mb-1">Nombre de personnes</label>
              <input
                type="number"
                min="1"
                className="form-control w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Ex : 4"
                value={servings}
                onChange={e => setServings(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {/* Composant de chargement d'image webp sous la difficulté */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Image (.webp uniquement)</label>
          <input
            type="file"
            accept="image/webp"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Aperçu"
              className="mt-2 rounded max-h-40 border"
            />
          )}
        </div>
        {/* Champ Citation (optionnel) */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Citation (optionnel)</label>
          <input
            type="text"
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            value={movieDescription}
            onChange={e => setMovieDescription(e.target.value)}
            placeholder="Saisissez une citation du film ou de la série"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Ingrédients</label>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <input
              className="form-control border border-gray-300 rounded px-3 py-2 flex-1"
              placeholder="Ajouter un ingrédient"
              value={ingredientInput}
              onChange={e => {
                setIngredientInput(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <input
              className="form-control border border-gray-300 rounded px-3 py-2 w-full sm:w-24"
              placeholder="Quantité"
              type="number"
              min="0"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
            />
            <input
              className="form-control border border-gray-300 rounded px-3 py-2 w-full sm:w-24"
              placeholder="Unité"
              value={unitInput}
              onChange={e => setUnitInput(e.target.value)}
            />
            <Button
              type="button"
              className="px-4 py-2 rounded border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              disabled={!ingredientInput || !quantityInput || !unitInput}
              onClick={() => handleAddIngredient(ingredientInput)}
            >
              +
            </Button>
          </div>
          {/* Suggestions d'autocomplétion */}
          {ingredientSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {ingredientSuggestions.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIngredientInput(ingredient.name);
                    handleAddIngredient(ingredient.name);
                    setShowSuggestions(false);
                  }}
                >
                  {ingredient.name}
                </li>
              ))}
            </ul>
          )}
          
          {/* Affichage des ingrédients sélectionnés */}
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedIngredients.map((ing, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded"
              >
                <span>
                  {ing.ingredientName} - {ing.quantity} {ing.unit}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newIngredients = [...selectedIngredients];
                    newIngredients.splice(index, 1);
                    setSelectedIngredients(newIngredients);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* --- Début de la card film (identique AddRecipePage) --- */}
        <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-semibold mb-0">Film associé</label>
            {!selectedMovie && (
              <Button
                type="button"
                className="ml-auto"
                onClick={() => setShowMovieSearch(true)}
              >
                Associer un film
              </Button>
            )}
          </div>
          {selectedMovie && (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {selectedMovie.poster_path && (
                <img
                  src={getImageUrl(selectedMovie.poster_path)}
                  alt={selectedMovie.title}
                  className="w-20 h-28 object-cover rounded"
                />
              )}
              <div>
                <div className="font-bold text-lg">{selectedMovie.title}</div>
                {selectedMovie.release_date && (
                  <div className="text-sm text-gray-500 mb-1">
                    {new Date(selectedMovie.release_date).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
                {selectedMovie.overview && (
                  <div className="text-sm text-gray-700 mt-2">{selectedMovie.overview}</div>
                )}
                <Button
                  type="button"
                  className="mt-2"
                  variant="ghost"
                  onClick={() => setSelectedMovie(null)}
                >
                  Retirer
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Catégorie</label>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <span className="text-gray-400">Aucune catégorie disponible</span>
            ) : (
              categories.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 border rounded px-3 py-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="categorie"
                    value={cat.id}
                    checked={category === cat.id}
                    onChange={e => setCategory(e.target.value)}
                    className="radio"
                  />
                  {cat.name}
                </label>
              ))
            )}
          </div>
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-1/3 py-2 rounded font-bold"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            className="w-2/3 py-2 rounded font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer la recette"}
          </Button>
        </div>
        {message && (
          <div className={"mt-4 text-center " + (message.includes("Erreur") ? "text-red-600" : "text-green-600")}>
            {message}
          </div>
        )}
      </form>
      {showMovieSearch && (
        <MovieSearchModal
          open={showMovieSearch}
          onClose={() => setShowMovieSearch(false)}
          onSelect={handleMovieSelect}
        />
      )}
    </div>
  );
};

export default AddRecipePage;



