import authService from '../../services/api/AuthServices';
import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const AccountPage: React.FC = () => {
  // Utilisation de l'atome pour gérer l'utilisateur connecté
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  // États pour gérer les champs du formulaire et les erreurs
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(authUser?.firstName || '');
  const [lastName, setLastName] = useState(authUser?.lastName || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Enregistrer les modifications (exemple : appel à l'API)
    console.log({ firstName, lastName, email, password });
    setIsEditing(false); // Désactiver le mode édition après sauvegarde
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-customYellow py-8 pb-12 relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Mon compte</h1>

        {/* Bloc flottant */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-1/3 bg-white shadow-lg rounded-md p-6 flex flex-col items-center w-2/3">
          {/* Icône crayon pour modifier */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={handleEditToggle}
          >
            <FaPencilAlt size={20} />
          </button>

          {/* Affichage ou édition des informations */}
          {isEditing ? (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-2"
                placeholder="Prénom"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-2"
                placeholder="Nom"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-2"
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-4"
                placeholder="Mot de passe (requis pour modifier)"
              />
              <button
                className="bg-customYellow text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={handleSave}
              >
                Enregistrer
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg sm:text-2xl font-bold text-black">{authUser?.firstName} {authUser?.lastName}</h2>
              <h3 className="flex items-center gap-2 mt-2 text-gray-500 text-sm">{authUser?.email}</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
