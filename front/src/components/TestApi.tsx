import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiTest';
import { Recipe } from '../types/index';

export const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await apiService.getAllRecipes();
        setRecipes(response.data);
      } catch (err) {
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
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>Film: {recipe.movieTitle}</p>
        </div>
      ))}
    </div>
  );
};