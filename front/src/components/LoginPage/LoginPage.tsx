/**
 * Composant de la page de connexion - Implémentation mobile-first
 * Le formulaire s'adapte en largeur selon le device tout en restant centré
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import authService from '../../services/auth';

// TODO: Ajouter Jotai pour la gestion de l'état global
// import { useAtom } from 'jotai';
// import { authUserAtom } from '../store/authUser';

const LoginPage: React.FC = () => {
  // Navigation et références
  const navigate = useNavigate();
  const inputEmailRef = useRef<HTMLInputElement>(null);

  // TODO: État global de l'utilisateur avec Jotai
  // const [, setAuthUser] = useAtom(authUserAtom);

  // États pour gérer les champs du formulaire et les erreurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Focus automatique sur l'email au chargement
  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  /**
   * Gère la soumission du formulaire de connexion
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setError('');
    
    try {
      // Connexion via le service d'authentification
      await authService.login({ email, password });
      
      // TODO: À activer une fois Jotai installé
      // const user = await authService.getMe();
      // setAuthUser(user);
      
      // Redirection vers la page d'accueil
      navigate('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error('Erreur lors de la connexion:', err);
    }
  };

  return (
    <div className="px-4 py-6 bg-white">
      {/* Container du formulaire avec largeur maximale et centrage */}
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Connexion</h1>

        {/* Formulaire avec bordure et ombre légère */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-4 sm:p-8 shadow-md">
          {/* Champ Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Adresse e-mail</label>
            <input
              ref={inputEmailRef}
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

          {/* Bouton de soumission */}          <Button 
            type="submit"
            className="w-full bg-white border border-gray-400 rounded py-2 text-base font-medium"
          >
            Se connecter
          </Button>
        </form>

        {/* Liens d'inscription et mot de passe oublié */}
        <div className="text-center mt-4 space-y-2">
          <Link to="/register" className="block text-xs text-gray-700 underline hover:text-red-500">
            Pas encore de compte ? Inscrivez-vous
          </Link>
          <Link to="/forgot-password" className="block text-xs text-gray-700 underline hover:text-red-500">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
