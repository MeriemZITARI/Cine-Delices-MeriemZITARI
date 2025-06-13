import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from "../Button/Button";

// Interfaces
interface SearchFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDuration: number | null;
  onDurationSelect: (duration: number) => void;
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
  return (
    <div className="bg-white p-4 h-[400px]">
      <h3 className="text-base font-bold sm:text-lg mb-2">Je cherche...</h3>
      <form onSubmit={onSubmit}>
        <div className="flex items-center border rounded-md p-2 mb-4 sm:mb-5">
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
        
        <h3 className="text-base font-bold sm:text-lg mb-2">J'ai...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[15, 30, 45, 60].map((duration) => (
            <label key={duration} className="flex items-center">
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === duration}
                onChange={() => onDurationSelect(duration)}
                className="custom-radio"
              />
              {duration} minutes
            </label>
          ))}
        </div>

        <h3 className="text-base font-bold sm:text-lg mb-2">Je veux préparer...</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {['entrée', 'plat', 'dessert', 'boisson'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={selectedType === type}
                onChange={() => onTypeSelect(type)}
                className="custom-radio"
              />
              {type === 'entrée' ? 'Une entrée' :
              type === 'plat' ? 'Un plat principal' :
              type === 'dessert' ? 'Un dessert' : 'Une boisson'}
            </label>
          ))}
        </div>

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