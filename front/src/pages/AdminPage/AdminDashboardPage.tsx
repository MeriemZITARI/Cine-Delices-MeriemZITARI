import { useEffect, useState } from "react";
import { useAdminUsers, UserFilters } from "../../hooks/query/admin/adminUser";

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'recipes'>('users');

  // États pour les filtres
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState<'all' | 'true' | 'false'>('all');
  const [searchFilters, setSearchFilters] = useState<UserFilters | null>(null);

  // On extrait les filtres en-dehors du hook pour qu'il soit recalculé à chaque soumission
const filters = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: email || undefined,
    isAdmin:
      isAdmin === 'all'
        ? undefined
        : isAdmin === 'true'
        ? true
        : false,
  };
  
  // TanStack Query : on désactive la requête automatique avec `enabled: false`
  // On pourra ensuite déclencher manuellement avec refetch()
  const {
    data: users,
    isLoading,
    error,
    refetch, // Permet de relancer la requête manuellement
    
  } = useAdminUsers(searchFilters ?? {}, false);

  useEffect(() => {
    if (searchFilters !== null) {
      refetch();
    }
  }, [searchFilters]);
  
  
  // Fonction appelée quand on clique sur "Chercher"
  const handleSearch = () => {
    // On met à jour les filtres de recherche
    setSearchFilters(filters);
    
  };
  

  return (
    <div className="bg-gray-50">
      {/* Bandeau jaune */}
      <div className="bg-customYellow pt-8 pb-20">
        <h1 className="text-3xl font-bold text-center mb-2 font-broadway">
          Dashboard Admin
        </h1>
        <p className="text-center text-lg font-semibold">
          Bienvenue dans l'espace d'administration.
        </p>
      </div>

      <div className="relative -mt-20">
        {/* Onglets */}
        <div className="flex justify-center gap-4 mt-8 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-white text-black font-bold' : 'bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'recipes' ? 'bg-white text-black font-bold' : 'bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('recipes')}
          >
            Recettes
          </button>
        </div>

        {/* Contenu */}
        <div className="bg-white shadow-lg rounded-md p-6 w-[85%] md:max-w-[80%] mx-auto relative -mt-8 mb-6">
        {activeTab === 'users' && (
  <>
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      {/* Champs de filtre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin ?</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="isAdmin"
              value="all"
              checked={isAdmin === 'all'}
              onChange={() => setIsAdmin('all')}
            />
            Tous
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="isAdmin"
              value="true"
              checked={isAdmin === 'true'}
              onChange={() => setIsAdmin('true')}
            />
            Oui
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="isAdmin"
              value="false"
              checked={isAdmin === 'false'}
              onChange={() => setIsAdmin('false')}
            />
            Non
          </label>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Chercher
        </button>
      </div>
    </form>

    {/* Résultats de la recherche */}
    <div className="mt-6">
      {isLoading && <p className="text-center text-gray-600">Chargement...</p>}
      {error && (
        <p className="text-center text-red-600">
          Erreur : {(error as Error).message}
        </p>
      )}
      {users && users.length === 0 && (
        <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
      )}
      {users && users.length > 0 && (
         <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
        )}
        {users && users.length > 0 && (
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden mt-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b border-gray-300">Prénom</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Nom</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Email</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Rôle</th>
                <th className="px-4 py-2 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{user.firstName}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{user.lastName}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{user.email}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <span className={user.isAdmin ? "text-green-600" : "text-gray-500"}>
                      {user.isAdmin ? "Admin" : "Utilisateur"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    <button
                      onClick={() => console.log("Ouvrir modale pour", user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded"
                    >
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      
      )}
    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
