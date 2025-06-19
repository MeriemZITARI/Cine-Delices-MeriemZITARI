// Imports principaux : React, hooks, service d'API pour les catégories, icône et bouton
import React, { useState, useEffect } from 'react';
import { categoryService, Category } from '../../services/api/CategoryService';
import { Search } from 'lucide-react';
import Button from "../Button/Button";

// Interface des props attendues par le composant SearchForm
interface SearchFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDuration: number | null;
  onDurationSelect: (duration: number | null) => void;
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

// Composant SearchForm principal
const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  searchTerm,
  onSearchChange,
  selectedDuration,
  onDurationSelect,
  selectedType,
  onTypeSelect
}) => {
  // State pour stocker les catégories récupérées depuis l'API
  const [categories, setCategories] = useState<Category[]>([]);
  // State pour indiquer si les catégories sont en cours de chargement
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Effet qui charge les catégories au montage du composant
  useEffect(() => {
    setLoadingCategories(true);
    categoryService.getCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  return (
    <div className="bg-white p-4 md:h-[400px]">
      {/* Champ de recherche textuelle */}
      <h3 className="text-base font-bold sm:text-lg mb-1">Je cherche...</h3>
      <form onSubmit={onSubmit}>
        {/* Input texte pour la recherche */}
        <div className="flex items-center border rounded-md p-2 mb-4 sm:mb-4">
          <div className="flex items-center justify-center text-gray-400 mr-3">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Star Wars, pizza, chocolat, ..." 
            className="w-full text-sm sm:text-base outline-none"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Radios pour la durée */}
        <h3 className="text-base font-bold sm:text-lg mb-1">J'ai...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
        {[30, 60, 90, null].map((duration) => (
          <label key={duration ?? 'no-limit'} className="flex items-center">
            <input
              type="radio"
              name="duration"
              checked={selectedDuration === duration}
              onChange={() => onDurationSelect(duration)}
              className="custom-radio"
            />
            {duration ? `${duration} minutes` : 'Aucune limite'}
          </label>
        ))}
        </div>

        {/* Radios dynamiques pour les catégories */}
        <h3 className="text-base font-bold sm:text-lg mb-1">Je veux préparer...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {loadingCategories && (
            <span className="text-gray-500 col-span-2">Chargement...</span>
          )}
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={selectedType === cat.name}
                onChange={() => onTypeSelect(cat.name)}
                className="custom-radio"
              />
              {cat.name}
            </label>
          ))}
        </div>

        {/* Bouton de validation */}
        <Button 
          text="C'est parti !" 
          type="submit" 
          className="w-full"
        />
      </form>
    </div>
  );
};

export default SearchForm;