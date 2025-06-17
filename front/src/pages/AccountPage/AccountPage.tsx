import { useState } from 'react';
import ProfileSection from '../../components/AccountPage/ProfileSection';
import RecipesSection from '../../components/AccountPage/RecipesSection';

const AccountPage: React.FC = () => {
  // États pour gérer les champs du formulaire et les erreurs
  const [activeTab, setActiveTab] = useState<'profile' | 'recipes'>('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-customYellow py-8 pb-12 relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Mon compte</h1>

        {/* Onglets */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'profile' ? 'bg-white text-black font-bold' : 'bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Mon profil
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'recipes' ? 'bg-white text-black font-bold' : 'bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('recipes')}
          >
            Mes recettes
          </button>
        </div>

        {/* Bloc flottant */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-[20px] bg-white shadow-lg rounded-md p-6 flex flex-col items-center w-4/5">
          {activeTab === 'profile' ? (
            <>
              <ProfileSection />
            </>
          ) : (
            <RecipesSection />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
