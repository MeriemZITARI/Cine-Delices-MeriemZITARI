// src/components/AdminDashboard/AdminRecipesSection.tsx
import { useState, useEffect } from "react";
import { useAdminRecipes, useAdminDeleteRecipe } from "../../hooks/query/admin/adminRecipe";
import { IRecipe } from "../../types/Recipe";
import { useCategories } from "../../hooks/query/category";
import { useIngredients } from "../../hooks/query/ingredient";
import { useRef } from "react";
import EditRecipeModal from "../../components/AdminDashboard/AdminEditRecipeModal";

const AdminRecipesSection: React.FC = () => {
  // Nouveaux filtres
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isValidated, setIsValidated] = useState<boolean | undefined>(undefined);

  const [filters, setFilters] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
const statusRef = useRef<HTMLParagraphElement>(null);

 // Nouveaux états pour le modal
 const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const { data: recipes, isLoading, error, refetch } = useAdminRecipes(filters);
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: allIngredients = [], isLoading: loadingIngredients } = useIngredients();
  const deleteRecipeMutation = useAdminDeleteRecipe();

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

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 4000); // 4 secondes
  
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  useEffect(() => {
  if (statusMessage && statusRef.current) {
    statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, [statusMessage]);

 // Ouvre le modal d'édition avec la recette sélectionnée
 const openEditModal = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  // Ferme le modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecipe(null);
    refetch(); // rafraîchir la liste après édition
  };
  

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <form
  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
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
    className="w-full md:flex-1 border border-gray-300 rounded px-3 py-2"
  />

  <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    className="w-full md:flex-1 border border-gray-300 rounded px-3 py-2"
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
    className="w-full md:flex-1 border border-gray-300 rounded px-3 py-2"
  >
    <option value="">Toutes</option>
    <option value="true">Validées</option>
    <option value="false">Non validées</option>
  </select>

  <button
    type="submit"
    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
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
      {statusMessage && (
  <p
    ref={statusRef}
    className={`text-center mt-4 font-semibold ${
      statusType === 'success' ? 'text-green-800' : 'text-red-600'
    }`}
  >
    {statusMessage}
  </p>
)}

        {recipes && recipes.length > 0 && (
            <>
             <div className="mb-4 text-center font-medium text-yellow-700">
        {recipes.filter((r) => r.isValidated === false).length > 0
          ? `⚠️ ${recipes.filter((r) => r.isValidated === false).length} recette(s) en attente de validation`
          : '✅ Toutes les recettes sont validées'}
      </div>
      <div className="overflow-x-auto">
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
                  <td className="px-4 py-2 border-b text-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => openEditModal(recipe)}
                      className="bg-green-800 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Éditer
                    </button>
                    <button
                       onClick={() => {
                        if (window.confirm(`Supprimer "${recipe.title}" ?`)) {
                          deleteRecipeMutation.mutate(recipe.id, {
                          onSuccess: () => {
  setStatusMessage("Recette supprimée avec succès.");
  setStatusType('success');
},
onError: (err) => {
  setStatusMessage((err as Error).message);
  setStatusType('error');
},
                          });
                        }
                      }} 
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </>
        )}
           {/* Modal d'édition */}
           {selectedRecipe && isEditModalOpen && Array.isArray(allIngredients) && Array.isArray(categories) && (
  <EditRecipeModal
    isOpen={isEditModalOpen}
    onClose={closeEditModal}
    recipe={selectedRecipe}
    allCategories={categories}
    allIngredients={allIngredients}
  />
)}
      </div>
    </div>
  );
};

export default AdminRecipesSection;
