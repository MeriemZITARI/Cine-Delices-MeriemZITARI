import React, { useState, useEffect } from "react";
import MovieSearchModal from './MovieSearchModal';
import { ingredientService, Ingredient } from '../services/api/IngredientService';

import { Button } from './ui/button';
import IngredientCard from './IngredientCard';

const AddRecipePage: React.FC = () => {
  // État vide initial pour l'ingrédient (sera géré dynamiquement plus tard)
  const emptyIngredient = { name: '', quantity: '', unit: '' };
  const [isMovieModalVisible, setIsMovieModalVisible] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [movieLink, setMovieLink] = useState('');
  const [moviePlot, setMoviePlot] = useState<string>('');
  const [movieReleaseDate, setMovieReleaseDate] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [manualIngredient, setManualIngredient] = useState('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMovieSelect = (movie: any) => {
    setMovieName(movie.title);
    setMovieLink(`https://www.themoviedb.org/movie/${movie.id}`);
    setMovieReleaseDate(movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : '');
    setMovieDescription(movie.overview || '');
    setIsMovieModalVisible(false);
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const data = await ingredientService.getIngredients();
        setIngredients(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des ingrédients');
        console.error(err);
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredient = () => {
    if (selectedIngredient) {
      const ingredient = ingredients.find(i => i.id === parseInt(selectedIngredient));
      if (ingredient) {
        setIngredientName(ingredient.name);
      }
    } else {
      setIngredientName(manualIngredient);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
    
      <main className="flex-1 px-2 py-4 sm:px-4 md:px-8 lg:px-24 xl:px-48 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Ajouter une nouvelle recette</h1>
        
        {/* Formulaire d'ajout de recette */}
        <form className="flex flex-col gap-6">
          {/* Section: Informations générales de la recette */}
          <section className="border rounded-lg p-4 md:p-6 flex flex-col gap-4">
            <h2 className="font-semibold mb-2">Informations générales de la recette</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Titre de la recette</label>
                <div className="border rounded">
                  <input type="text" placeholder="Ex: La ratatouille de Rémy" className="input w-full border-none focus:ring-0" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Durée (en minutes)</label>
                <div className="border rounded">
                  <input type="text" placeholder="Ex: 90" className="input w-full border-none focus:ring-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Description</label>
              <div className="border rounded">
                <textarea placeholder="Décrivez votre recette et son lien avec le film/la série" className="textarea w-full border-none focus:ring-0" rows={3} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Difficulté</label>
                <div className="border rounded">
                  <select className="select w-full border-none focus:ring-0">
                    <option value="">Sélectionner la difficulté</option>
                    <option value="facile">Facile</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="difficile">Difficile</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Nombre de personnes</label>
                <div className="border rounded">
                  <input type="text" placeholder="Ex: 4" className="input w-full border-none focus:ring-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Illustration de la recette</label>
                <div className="border rounded">
                  <input type="file" accept="image/*" className="file-input w-full border-none focus:ring-0" />
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-6 md:mt-0">Aucun fichier choisi</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Citation (optionnel)</label>
              <div className="border rounded">
                <input type="text" placeholder="Ex: La cuisine, c'est de l'amour que l'on peut goûter" className="input w-full border-none focus:ring-0" />
              </div>
            </div>
          </section>

          {/* Section: Ingrédients */}
          <section className="border rounded-lg p-4 md:p-6 flex flex-col gap-4">
            <h2 className="font-semibold mb-2">Ingrédients</h2>
            
            <div>
              {/* Utilisation du composant IngredientCard */}
              <IngredientCard 
                value={emptyIngredient}
                onChange={(field, value) => {
                  // Cette fonction sera implémentée plus tard pour gérer l'état
                  console.log(`Field ${field} changed to ${value}`);
                }}
              />
              
              {/* Sélecteur d'ingrédients */}
              <div className="card">
                <h3>Ingrédients</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select 
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Sélectionner un ingrédient</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="btn btn-primary"
                  >
                    Ajouter
                  </button>
                </div>

                {!selectedIngredient && (
                  <input
                    type="text"
                    value={manualIngredient}
                    onChange={(e) => setManualIngredient(e.target.value)}
                    placeholder="Ou saisissez un nouvel ingrédient"
                    className="form-control"
                  />
                )}
                {error && <div className="error-message">{error}</div>}
              </div>
            </div>
          </section>

          {/* Section: Media associé */}
          <section className="border rounded-lg p-4 md:p-6 flex flex-col gap-4">
            <h2 className="font-semibold mb-2">Media associé (Film/Série)</h2>
            
            
            <div style={{ marginBottom: '15px' }}>
              <button 
                type="button"
                onClick={() => setIsMovieModalVisible(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Rechercher un film
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Nom du film</label>
              <div className="border rounded">
                <input
                  type="text"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  placeholder="Nom du film"
                  className="input w-full border-none focus:ring-0"
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Date de sortie</label>
              <div className="border rounded">
                <input
                  type="text"
                  value={movieReleaseDate}
                  onChange={(e) => setMovieReleaseDate(e.target.value)}
                  placeholder="Date de sortie"
                  className="input w-full border-none focus:ring-0"
                  style={{ marginTop: '10px' }}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Lien du film</label>
              <div className="border rounded">
                <input
                  type="text"
                  value={movieLink}
                  onChange={(e) => setMovieLink(e.target.value)}
                  placeholder="Lien du film"
                  className="input w-full border-none focus:ring-0"
                  style={{ marginTop: '10px' }}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Description du film</label>
              <div className="border rounded">
                <textarea
                  value={movieDescription}
                  onChange={(e) => setMovieDescription(e.target.value)}
                  placeholder="Description du film"
                  className="textarea w-full border-none focus:ring-0"
                  rows={4}
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Section: Catégorie */}
          <section className="border rounded-lg p-4 md:p-6 flex flex-col gap-4">
            <h2 className="font-semibold mb-2">Catégorie</h2>
            <div className="flex flex-row flex-wrap gap-4">
              <label className="flex items-center gap-2 border rounded px-3 py-1">
                <input type="radio" name="categorie" className="radio" />
                Dessert
              </label>
              <label className="flex items-center gap-2 border rounded px-3 py-1">
                <input type="radio" name="categorie" className="radio" />
                Plat Principal
              </label>
              <label className="flex items-center gap-2 border rounded px-3 py-1">
                <input type="radio" name="categorie" className="radio" />
                Entrée
              </label>
              <label className="flex items-center gap-2 border rounded px-3 py-1">
                <input type="radio" name="categorie" className="radio" />
                Boisson
              </label>
              <label className="flex items-center gap-2 border rounded px-3 py-1">
                <input type="radio" name="categorie" className="radio" />
                Autre
              </label>
            </div>
          </section>

          {/* Boutons de soumission et d'annulation */}
          <div className="flex flex-col md:flex-row justify-end gap-4 mt-2">
            <Button 
              variant="outline" 
              className="w-full md:w-40"
              onClick={() => {}}
            >
              Annuler
            </Button>
            <Button 
              variant="primary" 
              className="w-full md:w-52"
              type="submit"
            >
              Enregistrer la Recette
            </Button>
          </div>
        </form>

        <MovieSearchModal
          visible={isMovieModalVisible}
          onCancel={() => setIsMovieModalVisible(false)}
          onSelect={handleMovieSelect}
        />
      </main>
    
    </div>
  );
};

export default AddRecipePage;


