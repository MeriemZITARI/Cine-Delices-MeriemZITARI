import React from 'react';
import { Search } from 'lucide-react';
import Button from "../Button/Button";
import { useCategories, Category } from '../../hooks/query/category'; // ← le hook React Query

interface SearchFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDuration: number | null;
  onDurationSelect: (duration: number | null) => void;
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  searchTerm,
  onSearchChange,
  selectedDuration,
  onDurationSelect,
  selectedType,
  onTypeSelect
}) => {
  // 🔁 Appel de TanStack Query
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="bg-white p-4 md:h-[400px]">
      <h3 className="text-base font-bold sm:text-lg mb-1">Je cherche...</h3>
      <form onSubmit={onSubmit}>
        {/* 🔍 Barre de recherche */}
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

        {/* ⏱️ Choix de durée */}
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

        {/* 🍽️ Choix de catégories */}
        <h3 className="text-base font-bold sm:text-lg mb-1">Je veux préparer...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {isLoading && (
            <span className="text-gray-500 col-span-2">Chargement...</span>
          )}
          {categories?.map((cat: Category) => (
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

        {/* ✅ Bouton */}
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
