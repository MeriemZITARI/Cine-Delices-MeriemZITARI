import { useState } from 'react';
import Button from '../../components/Button/Button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
}

const PasswordInput = ({
    value,
    onChange,
    showPassword,
    setShowPassword,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

    placeholder: string;
  }) => (
    <div className="relative mb-3">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
      />
      <button
        type="button"
        tabIndex={-1} // empêche la perte de focus
        onClick={() => setShowPassword(prev => !prev)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );


const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      if (onPasswordChange) {
        await onPasswordChange(currentPassword, newPassword);
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError('Erreur lors de la modification du mot de passe');
    }
  };

 

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">Modifier le mot de passe</h3>

        <PasswordInput
          placeholder="Mot de passe actuel"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showPassword={showCurrentPassword}
          setShowPassword={setShowCurrentPassword}
        />

        <PasswordInput
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
        />

        <PasswordInput
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
        />

        {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}

        <div className="flex justify-between gap-3">
          <Button
            text="Annuler"
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400"
          />
          <Button
            text="Enregistrer"
            onClick={handleSubmit}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
