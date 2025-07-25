import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from "../../components/Button/Button";
import { z } from 'zod';

import { useSignin } from '../../hooks/query/auth';

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useSignin();

  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      loginSchema.parse({ email, password });
      setError('');
      await loginMutation.mutateAsync({ email, password });
      navigate('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Cette combinaison e-mail/mot de passe n'a pas été trouvée.");
        console.error("Erreur lors de la connexion :", err);
      }
    }
  };

  return (
    <div className="px-4 py-6 bg-white">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Connexion</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-4 sm:p-8 shadow-md">
  
          {/* Email */}
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
              aria-describedby="emailHelp"
              required
            />
            <span id="emailHelp" className="sr-only">Entrez votre adresse e-mail, comme jean@example.com</span>
          </div>
  
          {/* Mot de passe */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="********"
              autoComplete="current-password"
              aria-describedby="passwordHelp"
              required
            />
            <span id="passwordHelp" className="sr-only">Entrez votre mot de passe pour accéder à votre compte</span>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
  
          {/* Erreur */}
          {error && (
            <div
              className="text-red-500 text-sm mb-3 text-center"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
  
          <Button text="Se connecter" type="submit" className="w-full" />
        </form>
  
        {/* Liens complémentaires */}
        <div className="text-center mt-4 space-y-2">
          <Link to="/creer-compte" className="block text-xs text-gray-700 underline hover:text-red-500">
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
