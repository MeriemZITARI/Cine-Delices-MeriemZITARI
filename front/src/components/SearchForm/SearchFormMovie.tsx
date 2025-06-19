import React from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchFormMovie: React.FC<SearchFormProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
}) => {
  return (
    <form onSubmit={onSearch} className="bg-white p-4 rounded shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        {/* Champ de recherche */}
        <div className="flex items-center border rounded-md p-2 w-full mb-2 sm:mb-0">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un film..."
            className="w-full text-sm outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Bouton rouge */}
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchFormMovie;
