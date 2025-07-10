// src/components/AdminDashboard/AdminRecipesSection.tsx
import { useState, useEffect } from "react";
import { useAdminRecipes } from "../../hooks/query/admin/adminRecipe";
import { IRecipe } from "../../types/Recipe";
import { useCategories } from "../../hooks/query/category";

const AdminRecipesSection: React.FC = () => {
  // Nouveaux filtres
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isValidated, setIsValidated] = useState<boolean | undefined>(undefined);

  const [filters, setFilters] = useState<any>({});
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const { data: recipes, isLoading, error, refetch } = useAdminRecipes(filters);
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  // const deleteRecipeMutation = useAdminDeleteRecipe();

  const handleSearch = () => {
    setFilters({
      title: title || undefined,
      categoryId: categoryId || undefined,
      isValidated, // peut être true, false ou undefined
    });
  };

  useEffect(() => {
    if (filters) refetch();
  }, [filters]);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <form
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
>
  <input
    type="text"
    placeholder="Titre recette"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
  />

  <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
  >
    <option value="">Toutes les catégories</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>

  <select
    value={isValidated === undefined ? '' : isValidated ? 'true' : 'false'}
    onChange={(e) => {
      if (e.target.value === '') setIsValidated(undefined);
      else setIsValidated(e.target.value === 'true');
    }}
    className="border border-gray-300 rounded px-3 py-2"
  >
    <option value="">Toutes</option>
    <option value="true">Validées</option>
    <option value="false">Non validées</option>
  </select>

  <button
    type="submit"
    className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
  >
    Rechercher
  </button>
</form>


      <div className="mt-6">
        {isLoading && <p className="text-center">Chargement...</p>}
        {error && <p className="text-center text-red-600">{(error as Error).message}</p>}
        {recipes && recipes.length === 0 && (
          <p className="text-center text-gray-600">Aucune recette trouvée.</p>
        )}
        {deleteMessage && <p className="text-red-600 text-center mt-4">{deleteMessage}</p>}

        {recipes && recipes.length > 0 && (
          <table className="w-full mt-4 border border-gray-300 rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Titre</th>
                <th className="px-4 py-2 border-b">Film</th>
                <th className="px-4 py-2 border-b">Catégorie</th>
                <th className="px-4 py-2 border-b">Auteur</th>
                <th className="px-4 py-2 border-b text-center">Validée</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe: IRecipe) => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{recipe.title}</td>
                  <td className="px-4 py-2 border-b">{recipe.movie?.title || '—'}</td>
                  <td className="px-4 py-2 border-b">{recipe.category?.name || '—'}</td>
                  <td className="px-4 py-2 border-b">
                    {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {recipe.isValidated ? '✅' : '❌'}
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => alert("TODO: Implémenter édition")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Éditer
                    </button>
                    <button
                      /* onClick={() => {
                        if (window.confirm(`Supprimer "${recipe.title}" ?`)) {
                          deleteRecipeMutation.mutate(recipe.id, {
                            onSuccess: () => {
                              setDeleteMessage(null);
                              alert("Recette supprimée avec succès.");
                            },
                            onError: (err) => {
                              setDeleteMessage((err as Error).message);
                            },
                          });
                        }
                      }} */
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRecipesSection;
