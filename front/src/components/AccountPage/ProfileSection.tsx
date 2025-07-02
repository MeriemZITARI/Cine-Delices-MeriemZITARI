import { z } from 'zod';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import { useMyAccount, useUpdateUserInfo, useUpdatePassword, useDeleteAccount } from '../../hooks/query/account';
import PasswordModal from './PasswordModal'; // à créer ou adapter

const userSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire."),
  lastName: z.string().min(1, "Le nom est obligatoire."),
  email: z.string().email("L'adresse e-mail n'est pas valide."),
});

const passwordSchema = z.object({
  password: z.string().regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
    "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial."
  ),
});

const ProfileSection: React.FC = () => {
  const { data: authUser } = useMyAccount();

  // Initialiser les champs quand authUser change
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  console.log('authUser:', authUser);

  useEffect(() => {
    if (authUser) {
      setFirstName(authUser.firstName);
      setLastName(authUser.lastName);
      setEmail(authUser.email);
    }
  }, [authUser]);

  const [errorInfo, setErrorInfo] = useState('');

  const updateInfoMutation = useUpdateUserInfo();
  const deleteAccountMutation = useDeleteAccount();
  const updatePasswordMutation = useUpdatePassword();

  // Modal mot de passe
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleInfoSave = () => {
    try {
      userSchema.parse({ firstName, lastName, email });
      setErrorInfo('');
      updateInfoMutation.mutate({ firstName, lastName, email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrorInfo(err.errors.map(e => e.message).join(' '));
      } else {
        setErrorInfo("Une erreur inconnue est survenue.");
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      deleteAccountMutation.mutate();
    }
  };

  // Callback passé à la modale pour modifier le mot de passe
  const handlePasswordChange = async(currentPassword: string, newPassword: string) : Promise<void> => {
    try {
      passwordSchema.parse({ password: newPassword });
      updatePasswordMutation.mutate({ currentPassword, newPassword }, {
        onSuccess: () => {
          setIsPasswordModalOpen(false);
        }
      });
    } catch (err) {
      // On peut gérer une erreur ici si besoin, mais modale gère ses erreurs
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 border border-gray-300 rounded shadow-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-6">Informations utilisateur</h2>

        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-center"
          autoComplete="given-name"
        />
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-center"
          autoComplete="family-name"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-center"
          autoComplete="email"
        />

        {errorInfo && <p className="text-red-600 font-semibold text-center">{errorInfo}</p>}

        <Button
          text="Enregistrer"
          onClick={handleInfoSave}
          className="w-full"
        />

        <Button
          text="Modifier le mot de passe"
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full bg-gray-300 hover:bg-gray-400"
        />
      </div>

      {/* Bouton suppression compte, large et en bas */}
      <div className="max-w-md mx-auto mt-6">
        <Button
          text="Supprimer le compte"
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDeleteAccount}
        />
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChange={handlePasswordChange}
      />
    </>
  );
};

export default ProfileSection;
