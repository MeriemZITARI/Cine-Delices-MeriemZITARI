// src/components/AdminDashboard/AdminUsersSection.tsx
import { useEffect, useState } from "react";
import { useAdminUsers, UserFilters, useAdminUpdateUser, useAdminDeleteUser } from "../../hooks/query/admin/adminUser";
import type { IUser } from '../../types/Auth';

const AdminUsersSection: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState<'all' | 'true' | 'false'>('all');
  const [searchFilters, setSearchFilters] = useState<UserFilters | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [localEditedUsers, setLocalEditedUsers] = useState<Record<string, Partial<IUser>>>({});

  const updateUserMutation = useAdminUpdateUser();
  const deleteUserMutation = useAdminDeleteUser();
  
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

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useAdminUsers(searchFilters ?? {}, true);

  useEffect(() => {
    if (searchFilters !== null) {
      refetch();
    }
  }, [searchFilters]);

  const handleSearch = () => {
    setSearchFilters(filters);
  };

  return (
    <>
      <form
  className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
>
  <input
    type="text"
    placeholder="Prénom"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
  />
  <input
    type="text"
    placeholder="Nom"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
  />
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
  />
  <select
    value={isAdmin}
    onChange={(e) => setIsAdmin(e.target.value as 'all' | 'true' | 'false')}
    className="border border-gray-300 rounded px-3 py-2"
  >
    <option value="all">Tous</option>
    <option value="true">Admins</option>
    <option value="false">Utilisateurs</option>
  </select>
  <button
    type="submit"
    className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
  >
    Rechercher
  </button>
</form>


      {/* Résultats */}
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
            {users && users.length > 0 && (
          <tbody>
          {users?.map((user) => {
            const isEditing = editUserId === user.id;
            const localUser = localEditedUsers[user.id] || user;
        
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* Prénom */}
                <td className="px-4 py-2 border-b border-gray-200">
                  {isEditing ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={localUser.firstName || ''}
                      onChange={(e) =>
                        setLocalEditedUsers((prev) => ({
                          ...prev,
                          [user.id]: { ...prev[user.id], firstName: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
        
                {/* Nom */}
                <td className="px-4 py-2 border-b border-gray-200">
                  {isEditing ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={localUser.lastName || ''}
                      onChange={(e) =>
                        setLocalEditedUsers((prev) => ({
                          ...prev,
                          [user.id]: { ...prev[user.id], lastName: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
        
                {/* Email */}
                <td className="px-4 py-2 border-b border-gray-200">
                  {isEditing ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={localUser.email || ''}
                      onChange={(e) =>
                        setLocalEditedUsers((prev) => ({
                          ...prev,
                          [user.id]: { ...prev[user.id], email: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
        
                {/* Rôle */}
                <td className="px-4 py-2 border-b border-gray-200">
                  {isEditing ? (
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={localUser.isAdmin ? 'true' : 'false'}
                      onChange={(e) =>
                        setLocalEditedUsers((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...prev[user.id],
                            isAdmin: e.target.value === 'true',
                          },
                        }))
                      }
                    >
                      <option value="true">Admin</option>
                      <option value="false">Utilisateur</option>
                    </select>
                  ) : (
                    <span className={user.isAdmin ? "text-green-600" : "text-gray-500"}>
                      {user.isAdmin ? "Admin" : "Utilisateur"}
                    </span>
                  )}
                </td>
        
                {/* Actions */}
                <td className="px-4 py-2 border-b border-gray-200 text-center space-x-2">
                  {isEditing ? (
                    <button
                      onClick={() => {
                        const updatedData = localEditedUsers[user.id];
                        updateUserMutation.mutate(
                          { userId: user.id, updates: updatedData },
                          {
                            onSuccess: () => {
                              setEditUserId(null);
                              setLocalEditedUsers((prev) => {
                                const newState = { ...prev };
                                delete newState[user.id];
                                return newState;
                              });
                            },
                            onError: (err) => {
                              alert("Erreur lors de la mise à jour.");
                              console.error(err);
                            },
                          }
                        );
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Sauvegarder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditUserId(user.id);
                        setLocalEditedUsers((prev) => ({
                          ...prev,
                          [user.id]: { ...user },
                        }));
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Éditer
                    </button>
                  )}
        
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) {
                        deleteUserMutation.mutate(user.id, {
                          onSuccess: () => {
                            alert(`✅ ${user.firstName} ${user.lastName} a bien été supprimé.`);
                          },
                          onError: (err) => {
                            alert("Erreur lors de la suppression.");
                            console.error(err);
                          },
                        });
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                    
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        
            )}
          </table>
        )}
      </div>
    </>
  );
};

export default AdminUsersSection;
