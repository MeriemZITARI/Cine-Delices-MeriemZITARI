import { z } from 'zod';
import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';
import { useState } from 'react';
import Button from '../../components/Button/Button';
import userService from '../../services/api/UserServices';
import { FaUserEdit } from 'react-icons/fa';

// Schéma de validation pour les informations de l'utilisateur
const userSchema = z.object({
    firstName: z.string().min(1, "Le prénom est obligatoire."),
    lastName: z.string().min(1, "Le nom est obligatoire."),
    email: z.string().email("L'adresse e-mail n'est pas valide."),
});
  
// Schéma de validation pour le mot de passe
const passwordSchema = z.object({
    password: z.string().regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial."
    ),
});
  

const ProfileSection : React.FC = () => {
  // Utilisation de l'atome pour gérer l'utilisateur connecté
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  // États pour gérer les champs du formulaire et les erreurs
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstName, setFirstName] = useState(authUser?.firstName || '');
  const [lastName, setLastName] = useState(authUser?.lastName || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [currentPassword, checkCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Traite les données du formulaire et fait les modifications
   * @param formData - Données du formulaire
  */
  async function handleInfoFormAction(formData: FormData) {
    try {
      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
      };
      
      // Update via le UserService
      const response = await userService.updateInfo(data);
      
      if (!response || !response.success || !response.user) {
        throw new Error("Échec de la modification des informations de l'utilisateur.");
      }
      
      setIsEditing(false);
      // Mise à jour de l'atome
      setAuthUser(response.user);
    } catch (err) {
      setError('Une erreur est survenue lors de la modification des informations de l\'utilisateur');
      //console.error('Erreur lors de la modification des informations de l\'utilisateur :', err);
    }
  }

  /**
   * Change le mot de passe
   * @param password - Données du formulaire
  */
  async function handlePasswordFormAction(password: String) {
    try {
      const data = {
        password: password as string,
      };
      
      // Changement du mot de passe
      const response = await userService.updatePassword(data);
      
      if (!response || !response.success) {
        throw new Error("Échec de la modification du mot de passe.");
      }
      console.log(response);
      setIsChangingPassword(false);
      // Mise à jour de l'atome
      //setAuthUser(response.user);

      // Redirection vers la page de connexion après inscription réussie
      //navigate('/');
    } catch (err) {
      setError('Une erreur est survenue lors de la modification du mot de passe');
      //console.error('Erreur lors de la modification du mot de passe :', err);
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInfoSave = () => {
    // Enregistrer les modifications
    if (authUser?.firstName !==  firstName || authUser?.lastName !== lastName || authUser?.email !== email) {
        try {
            // Valide les données avec Zod
            userSchema.parse({ firstName, lastName, email });
            setError(""); // Réinitialise les erreurs si tout est valide
            
            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            
            handleInfoFormAction(formData);
        } catch (err) {
            if (err instanceof z.ZodError) {
              // Récupère les messages d'erreur et les affiche
              const errorMessages = err.errors.map((error) => error.message).join(" ");
              setError(errorMessages);
            } else {
              setError("Une erreur inconnue est survenue.");
            }
        }
    } else {
        setError("");
        setIsEditing(false);
    }
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Tous les champs sont obligatoires !");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    
    try {
        // Valide les données avec Zod
        passwordSchema.parse({ password: newPassword });
        setError(""); // Réinitialise les erreurs si tout est valide
        
        handlePasswordFormAction(newPassword);
    } catch (err) {
        if (err instanceof z.ZodError) {
          // Récupère les messages d'erreur et les affiche
          const errorMessages = err.errors.map((error) => error.message).join(" ");
          setError(errorMessages);
        } else {
          setError("Une erreur inconnue est survenue.");
        }
    }
  };
  
  return (
    <>
      {!isEditing && !isChangingPassword && (
        <button
            className="absolute top-2 right-2 text-gray-700"
            onClick={handleEditToggle}
        >
            <FaUserEdit size={24} />
        </button>
      )}

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
          {error && <p className="font-bold text-red-500 text-sm mt-2 mb-4">{error}</p>}
          {/* Boutons Annuler et Enregistrer */}
            <div className="flex justify-around w-full gap-3">
            <Button
                text="Annuler"
                className="bg-gray-500 hover:bg-gray-700 flex-1"
                onClick={() => {
                    setIsEditing(false); // Quitter le mode édition
                    setFirstName(authUser?.firstName || '');
                  setLastName(authUser?.lastName || '');
                  setEmail(authUser?.email || '');
                  checkCurrentPassword(''); // Réinitialiser le mot de passe
                }}
            />
            <Button
              text="Enregistrer"
              className="flex-1"
              onClick={handleInfoSave}
              />
            </div>
        </>
      ) : isChangingPassword ? (
        <>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => checkCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-2"
            placeholder="Mot de passe actuel"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-2"
            placeholder="Nouveau mot de passe"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-base mb-4"
            placeholder="Confirmer le nouveau mot de passe"
          />
          {error && <p className="font-bold text-red-500 text-sm mt-2 mb-4">{error}</p>}
          <div className="flex justify-around w-full gap-3">
            <Button
              text="Annuler"
              className="bg-gray-500 hover:bg-gray-700 flex-1"
              onClick={() => {
                setIsChangingPassword(false);
                checkCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            />
            <Button
              text="Enregistrer"
              className="flex-1"
              onClick={handlePasswordChange}
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg sm:text-2xl font-bold text-black">{authUser?.firstName} {authUser?.lastName}</h2>
          <Button
            text="Modifier le mot de passe"
            className="mt-4"
            onClick={() => setIsChangingPassword(true)}
          />
        </>
      )}
    </>
  );
};

export default ProfileSection;