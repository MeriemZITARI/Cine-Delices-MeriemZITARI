import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useSignup } from '../../hooks/query/auth';
import { z } from 'zod';

// Schéma de validation
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
  const navigate = useNavigate();
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signupMutation = useSignup();

  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      registerSchema.parse({ firstName, lastName, email, password });
      setError('');
      await signupMutation.mutateAsync({ firstName, lastName, email, password });
      navigate('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((error) => error.message).join(" ");
        setError(errorMessages);
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
        console.error('Erreur lors de l\'inscription:', err);
      }
    }
  };

  return (
    <div className="px-4 py-6 bg-white">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-broadway">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-4 sm:p-8 shadow-md">
          <div className="flex flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Jean"
                autoComplete="given-name"
                required
              />
            </div>
          </div>

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
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

          <Button text="S'inscrire" type="submit" className="w-full" />
        </form>

        <div className="text-center mt-4">
          <Link to="/connexion" className="text-xs text-gray-700 underline hover:text-red-500">
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
