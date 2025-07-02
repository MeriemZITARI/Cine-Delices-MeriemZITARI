import Button from "../Button/Button";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-4 text-red-600">Confirmer la suppression</h3>
          <p className="mb-6">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
  
          <div className="flex justify-between gap-3">
            <Button
              text="Annuler"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400"
            />
            <Button
              text="Confirmer"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteAccountModal;
  