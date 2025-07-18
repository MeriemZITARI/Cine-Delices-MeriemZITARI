import { useState } from 'react';
import AdminUsersSection from '../../components/AdminDashboard/AdminUserSection';
import AdminIngredientsSection from '../../components/AdminDashboard/AdminIngredientSection';
import AdminRecipeSection from '../../components/AdminDashboard/AdminRecipeSection';


const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'recipes' | 'ingredients'>('users');

  return (
    <div className="bg-gray-50">
      <div className="bg-customYellow pt-8 pb-20">
        <h1 className="text-3xl font-bold text-center mb-2 font-broadway">
          Dashboard Admin
        </h1>
        <p className="text-center text-lg font-semibold">
          Bienvenue dans l'espace d'administration.
        </p>
      </div>

      <div className="relative -mt-20">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 mb-6 px-2">
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded border border-gray-300 transition-colors duration-200 ${activeTab === 'users' ? 'bg-white text-black font-bold shadow' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs
          </button>
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded border border-gray-300 transition-colors duration-200 ${activeTab === 'recipes' ? 'bg-white text-black font-bold shadow' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recettes
          </button>
          <button
    className={`w-full sm:w-auto px-4 py-2 rounded border border-gray-300 transition-colors duration-200 ${activeTab === 'ingredients' ? 'bg-white text-black font-bold shadow' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
    onClick={() => setActiveTab('ingredients')}
  >
    Ingrédients
  </button>
        </div>

        <div className="bg-white shadow-lg rounded-md p-6 w-[85%] md:max-w-[80%] mx-auto relative -mt-8 mb-6">
          {activeTab === 'users' && <AdminUsersSection />}
          {activeTab === 'recipes' && <AdminRecipeSection />}
          
          {activeTab === 'ingredients' && <AdminIngredientsSection />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
