import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from "../Button/Button";

const SearchForm: React.FC = () => {
  // États pour les différents critères de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Gère la sélection/désélection d'une durée
   * @param minutes - Durée en minutes
   */
  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes === selectedDuration ? null : minutes);
  };

  /**
   * Gère la sélection/désélection d'un type
   * @param type - Type de recette
   */
  const handleTypeSelect = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche
  };

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Je cherche ..</h3>
      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
        <div className="flex items-center border rounded-md p-2 sm:p-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-center text-gray-400 mr-3">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Star Wars, pizza, chocolat, ..." 
            className="w-full text-sm sm:text-base outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <h3 className="text-base sm:text-lg mb-2">J'ai ..</h3>
        <div className="mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3">
            {[15, 30, 45, 60].map((duration) => (
            <label key={duration} className="flex items-center text-sm sm:text-base">
                <input 
                type="radio" 
                name="duration" 
                className="mr-2"
                checked={selectedDuration === duration}
                onChange={() => handleDurationSelect(duration)}
                />
                {duration} minutes
            </label>
            ))}
        </div>
        </div>

        <h3 className="text-base sm:text-lg mb-2">Je veux préparer</h3>
        <div className="mb-4 sm:mb-6">
          <div className="grid grid-cols-2 gap-2">
            {['entrée', 'plat', 'dessert', 'boisson'].map((type) => (
            <label key={type} className="flex items-center text-sm sm:text-base">
                <input 
                type="radio" 
                name="type" 
                className="mr-2"
                checked={selectedType === type}
                onChange={() => handleTypeSelect(type)}
                />
                {type === 'entrée' ? 'une entrée' :
                type === 'plat' ? 'un plat' :
                type === 'dessert' ? 'un dessert' : 'une boisson'}
            </label>
            ))}
          </div>
        </div>
        
        <Button 
          text="C'est parti !"
          type="submit" 
          className="w-full text-sm sm:text-base"
        />
      </form>
    </div>
  );
};

export default SearchForm;