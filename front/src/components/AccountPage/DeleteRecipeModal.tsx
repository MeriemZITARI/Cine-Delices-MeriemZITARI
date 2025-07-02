import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';

interface DeleteRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: Error | null;
  recipeTitle?: string;
}

const DeleteRecipeModal: React.FC<DeleteRecipeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  error = null,
  recipeTitle = '',
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center"
      style={{ zIndex: 9999 }} // z-index très élevé pour être sûr que la modale soit au-dessus
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg"
        style={{ position: 'relative', zIndex: 10000, minWidth: '320px' }} // position relative + z-index plus élevé
      >
        <h3 id="delete-modal-title" className="text-lg font-bold mb-4">
          Confirmer la suppression
        </h3>
        <p id="delete-modal-desc">
          Voulez-vous vraiment supprimer la recette <strong>{recipeTitle}</strong> ?
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            text="Annuler"
            className="bg-gray-500 hover:bg-gray-700 flex-1"
            onClick={onClose}
            type="button"
          />
          <Button
            text={isLoading ? 'Suppression...' : 'Supprimer'}
            className="bg-red-600 hover:bg-red-800 flex-1"
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 mt-4">{error.message}</p>}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default DeleteRecipeModal;
