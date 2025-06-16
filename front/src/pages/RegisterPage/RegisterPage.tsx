/**
 * Composant de la page d'inscription - Implémentation mobile-first
 * Le formulaire s'adapte en largeur selon le device tout en restant centré
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from "../../components/Button/Button";
import authService from '../../services/api/AuthServices';

import { z } from 'zod';
import { useAtom } from 'jotai';
import { authUserAtom } from '../../store/authUserAtom';

// Schéma de validation pour le formulaire d'inscription
const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire."),
  lastName: z.string().min(1, "Le nom est obligatoire."),
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
      "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial."
    ),
});

const RegisterPage: React.FC = () => {
  // Navigation et références
  const navigate = useNavigate();
  const inputEmailRef = useRef<HTMLInputElement>(null);

  // Utilisation de l'atome pour gérer l'utilisateur connecté
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  // États pour gérer les champs du formulaire et les erreurs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Focus automatique sur l'email au chargement
  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  /**
   * Traite les données du formulaire et effectue l'inscription
   * @param formData - Données du formulaire
   */
  async function handleFormAction(formData: FormData) {
    try {
      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };
      
      // Inscription via le service d'authentification
      const response = await authService.register(data);
      
      if (!response || !response.success) {
        throw new Error("Échec de la création du compte utilisateur.");
      }
      
      // Mise à jour de l'atome
      setAuthUser(response.user);

      // Redirection vers la page de connexion après inscription réussie
      navigate('/');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error('Erreur lors de l\'inscription:', err);
    }
  }

  /**
   * Gère la soumission du formulaire d'inscription
   * Vérifie que tous les champs sont remplis avant de procéder
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      // Valide les données avec Zod
      registerSchema.parse({ firstName, lastName, email, password });
      setError(""); // Réinitialise les erreurs si tout est valide

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);

      handleFormAction(formData);
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
    // Container principal - Pas de flex-col pour coller sous le header
    <div className="px-4 py-6 bg-white">
      {/* Container du formulaire avec largeur maximale et centrage */}
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Créer un compte</h1>

        {/* Formulaire avec bordure et ombre légère */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-4 sm:p-8 shadow-md">
          {/* Section Nom/Prénom - Côte à côte sur tous les écrans */}
          <div className="flex flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName} // Associe l'état au champ
                onChange={(e) => setLastName(e.target.value)} // Met à jour l'état
                className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Dupont"
                autoComplete="family-name"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName} // Associe l'état au champ
                onChange={(e) => setFirstName(e.target.value)} // Met à jour l'état
                className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Jean"
                autoComplete="given-name"
                required
              />
            </div>
          </div>

          {/* Champ Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Adresse e-mail</label>
            <input
              ref={inputEmailRef}
              id="email"
              name="email"
              type="email"
              value={email} // Associe l'état au champ
              onChange={(e) => setEmail(e.target.value)} // Met à jour l'état
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="email@exemple.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password} // Associe l'état au champ
              onChange={(e) => setPassword(e.target.value)} // Met à jour l'état
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="********"
              autoComplete="new-password"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

          {/* Bouton de soumission */}
          <Button 
            text="S'inscrire"
            type="submit"
            className="w-full"
          />
        </form>

        {/* Lien de connexion */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-xs text-gray-700 underline hover:text-red-500">
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
