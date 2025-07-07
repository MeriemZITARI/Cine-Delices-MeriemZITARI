import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { FaPlusCircle, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

import { useAuthUser } from "../../hooks/query/auth";
import { useSignout } from "../../hooks/query/auth";

interface NavMobileProps {
  className?: string;
}

const NavDesktop: React.FC<NavMobileProps> = ({ className }) => {
  const navigate = useNavigate();

  const { data: authUser, isLoading } = useAuthUser();
  const logoutMutation = useSignout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  if (isLoading) {
    return (
      <header className={`bg-white text-black px-4 py-2 shadow-md relative ${className}`}>
        <div className="container mx-auto flex items-center justify-center h-16">
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </header>
    );
    
  }

  return (
    <header className={`bg-white text-black px-4 py-2 shadow-md relative ${className}`}>
      <div className="container mx-auto flex items-center justify-between h-16">
     
        <nav className="flex space-x-8 items-center text-2xl" style={{ fontFamily: 'Broadway, sans-serif' }}>
          <Link to="/" className="flex items-center h-full">
            <img src="/images/logo/logo.png" alt="Ciné Délices Logo" className="h-16" />
          </Link>

          <NavLink to="/recettes" className={({ isActive }) =>
            `text-black font-medium ${isActive ? "underline" : ""}`
          }>
            Recettes
          </NavLink>

          <NavLink to="/films" className={({ isActive }) =>
            `text-black font-medium ${isActive ? "underline" : ""}`
          }>
            Films
          </NavLink>

          {authUser && (
  <>
    <NavLink to="/ajouter-recette" title="Ajouter une recette" className={({ isActive }) =>
      `text-black font-medium ${isActive ? "underline" : ""}`
    }>
      Créer recette
    </NavLink>

    {authUser.isAdmin && (
      <NavLink to="/admin" className={({ isActive }) =>
        `text-black font-medium ${isActive ? "underline" : ""}`
      }>
        Administration
      </NavLink>
    )}
  </>
)}

        </nav>

        <div className="flex items-center">
          {authUser ? (
            <>
              <Link to="/mon-compte" className="flex items-center justify-center h-full text-black">
                <p className="mr-2">{authUser.firstName} {authUser.lastName}</p>
                <FaUserCircle size={36} />
              </Link>

              <button onClick={handleLogout} className="flex items-center justify-center h-full text-black ml-4">
                <FaSignOutAlt size={36} />
              </button>
            </>
          ) : (
            <Link to="/connexion" className="flex items-center justify-center h-full text-black">
              <Button text="Se connecter / S'inscrire" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavDesktop;
