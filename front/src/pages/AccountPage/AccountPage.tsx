import { useState } from 'react';
import ProfileSection from '../../components/AccountPage/ProfileSection';
import RecipesSection from '../../components/AccountPage/RecipesSection';

const AccountPage: React.FC = () => {
  // États pour gérer les champs du formulaire et les erreurs
  const [activeTab, setActiveTab] = useState<'profile' | 'recipes'>('profile');

  return (
    <div className="bg-gray-50">
      {/* Partie jaune avec le titre */}
      <div className="bg-customYellow pt-8 pb-20">
        <h1 className="text-3xl font-bold text-center mb-8 font-broadway">Mon compte</h1>
      </div>
  
      {/* Conteneur principal avec le contenu */}
      <div className="relative -mt-20">
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
        <div className="bg-white shadow-lg rounded-md p-6 flex flex-col items-center w-[85%] md:max-w-[80%] mx-auto relative -mt-8 mb-6">
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
