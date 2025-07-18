import { useState, useMemo } from "react";
import {
  useAdminIngredients,
  useAdminSearchIngredients,
  useAdminCreateIngredient,
  useAdminUpdateIngredient,
  useAdminDeleteIngredient,
} from '../../hooks/query/admin/adminIngredient';
import type { IIngredient } from "../../services/api/AdminService/adminIngredientService";


const AdminIngredientsSection: React.FC = () => {
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editIngredientId, setEditIngredientId] = useState<string | null>(null);
  const [localEditedIngredients, setLocalEditedIngredients] = useState<Record<string, Partial<IIngredient>>>({});
  const [newIngredientName, setNewIngredientName] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1); // ✅ nouvelle page sélectionnée
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);




  const isSearching = !!searchTerm.trim();
  const limit = 5; // ✅ nombre d'ingrédients par page
  


  // Memoize filters pour que l'objet ne change que si searchTerm change vraiment
  const filters = useMemo(() => ({ name: searchTerm.trim() }), [searchTerm]);

  const ingredientQuery = useAdminIngredients(!isSearching, page, limit);
 
  const searchQuery = useAdminSearchIngredients(filters);

  const createIngredient = useAdminCreateIngredient();
  const updateIngredient = useAdminUpdateIngredient();
  const deleteIngredient = useAdminDeleteIngredient();

  const ingredients = isSearching
  ? searchQuery.data ?? []
  : ingredientQuery.data?.data ?? [];
  const isLoading = isSearching ? searchQuery.isLoading : ingredientQuery.isLoading;
  const isError = isSearching ? searchQuery.isError : ingredientQuery.isError;
  const error = isSearching ? searchQuery.error : ingredientQuery.error;
  const total = isSearching ? 0 : ingredientQuery.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);


  const handleSearch = () => {
    setPage(1);
    setSearchTerm(name);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          placeholder="Nom de l'ingrédient"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Nouvel ingrédient"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
        />
       <button
  onClick={() => {
    if (newIngredientName.trim()) {
      createIngredient.mutate(
        { name: newIngredientName },
        {
          onSuccess: () => {
            setSuccessMessage("✅ L'ingrédient a bien été ajouté.");
            setCreateErrorMessage(null); // on nettoie l'erreur de création
            setNewIngredientName('');
            // Optionnel : Effacer le message après 3 secondes
            setTimeout(() => setSuccessMessage(null), 3000);
          },
          onError: (err) => {
            const message =
              (err as any)?.response?.data?.message ||
              (err as Error).message ||
              "Erreur inconnue lors de l'ajout.";
            setCreateErrorMessage(message);
            setSuccessMessage(null); // on nettoie le succès
            
            console.error(err);
          },
        }
      );
    }
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  Ajouter
</button>
{successMessage && (
  <p className="mt-2 text-green-600 font-medium">{successMessage}</p>
)}
{createErrorMessage && (
  <p className="mt-2 text-red-600 font-medium">{createErrorMessage}</p>
)}
      </div>

      <div className="mt-6">
        {isLoading && <p className="text-center">Chargement...</p>}
        {isError && (
          <p className="text-center text-red-600">
            Erreur : {(error as Error).message}
          </p>
        )}
        {ingredients && ingredients.length === 0 && (
          <p className="text-center text-gray-500">Aucun ingrédient trouvé.</p>
        )}
        {deleteErrorMessage && (
  <div className="mt-4 text-red-600 text-center">
    {deleteErrorMessage}
  </div>
)}

        {ingredients && (
          <table className="w-full mt-4 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Nom</th>
                <th className="text-center px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => {
                const isEditing = editIngredientId === ingredient.id;
                const localIngredient = localEditedIngredients[ingredient.id] || ingredient;
                return (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      {isEditing ? (
                        <input
                          className="border px-2 py-1 rounded w-full"
                          value={localIngredient.name || ''}
                          onChange={(e) =>
                            setLocalEditedIngredients((prev) => ({
                              ...prev,
                              [ingredient.id]: { name: e.target.value },
                            }))
                          }
                        />
                      ) : (
                        ingredient.name
                      )}
                    </td>
                    <td className="px-4 py-2 border-b text-center space-x-2">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      {isEditing ? (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          onClick={() => {
                            const updatedData = localEditedIngredients[ingredient.id];
                            updateIngredient.mutate(
                              { id: ingredient.id, updates: updatedData },
                              {
                                onSuccess: () => {
                                  setEditIngredientId(null);
                                  setLocalEditedIngredients((prev) => {
                                    const newState = { ...prev };
                                    delete newState[ingredient.id];
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
                        >
                          Sauvegarder
                        </button>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setEditIngredientId(ingredient.id);
                            setLocalEditedIngredients((prev) => ({
                              ...prev,
                              [ingredient.id]: { ...ingredient },
                            }));
                          }}
                        >
                          Éditer
                        </button>
                      )}
                      <button
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
  onClick={() => {
    const confirmed = window.confirm(`Supprimer ${ingredient.name} ?`);
    if (!confirmed) return;

    deleteIngredient.mutate(ingredient.id, {
      onSuccess: () => {
        setDeleteErrorMessage(null); // Nettoyage en cas de succès
        setSuccessMessage(`✅ ${ingredient.name} a bien été supprimé.`);
        setTimeout(() => setSuccessMessage(null), 3000); // facultatif : cacher après 3s
      },
      onError: (error) => {
        const message =
    (error as any)?.response?.data?.message ||
    (error as Error).message ||
    "Erreur inconnue lors de la suppression.";
  setDeleteErrorMessage(message);
      },
    });
  }}
>
  Supprimer
</button>
</div>
{successMessage && (
  <p className="mt-2 text-green-600 font-medium">{successMessage}</p>
)}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      {ingredients && ingredients.length > 0 && !isSearching && (
  <div className="flex justify-center items-center mt-4 space-x-4">
    <button
      disabled={page === 1}
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
    >
      ← Précédent
    </button>
    <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
    <button
      disabled={page >= totalPages}
      onClick={() => setPage((prev) => prev + 1)}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
    >
      Suivant →
    </button>
  </div>
)}


      </div>
    </div>
  );
};

export default AdminIngredientsSection;
