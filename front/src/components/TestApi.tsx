import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiTest';
import { Recipe } from '../types/index';

const TestApi: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await apiService.getAllRecipes();
        console.log('Response:', response); // Pour déboguer
        if (response.recipes && Array.isArray(response.recipes)) {
          setRecipes(response.recipes);
        } else {
          throw new Error('Structure inattendue des données');
        }
      } catch (err) {
        console.error('Erreur détaillée:', err);
        setError('Erreur lors de la récupération des recettes');
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Liste des Recettes</h2>
      {recipes.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded">
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <p>Durée : {recipe.duration} minutes</p>
          <p>Difficulté : {recipe.difficulty}/5</p>
          {recipe.category && <p>Catégorie : {recipe.category.name}</p>}
          {recipe.movie && <p>Film : {recipe.movie.title}</p>}
        </div>
      ))}
    </div>
  );
};

export default TestApi;