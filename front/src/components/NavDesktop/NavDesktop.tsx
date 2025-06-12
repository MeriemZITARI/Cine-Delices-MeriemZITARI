import { Link, NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAtom } from "jotai";
import { authUserAtom } from "../../store/authUserAtom";

interface NavMobileProps {
  className?: string; // Permet de passer des classes CSS pour afficher/masquer le menu desktop
}

const NavDesktop: React.FC<NavMobileProps> = ({ className }) => {
  const [authUser] = useAtom(authUserAtom);
  
  return (
    <header className={`bg-white text-black px-4 py-2 shadow-md relative ${className}`}>
      <div className="container mx-auto flex items-center justify-between h-16">
        <nav className="flex space-x-8 items-center text-2xl" style={{ fontFamily: 'Broadway, sans-serif' }}>
          <Link
            to="/"
            className="flex items-center h-full"
          >
            <img
              src="/images/logo/logo.png"
              alt="Ciné Délices Logo"
              className="h-16"
            />
          </Link>
          <NavLink 
            to="/recettes" 
            className={({ isActive }) =>
            `text-black font-medium ${isActive ? "underline" : ""}`
            }
          >
            Recettes
          </NavLink>
          <NavLink 
            to="/films" 
            className={({ isActive }) =>
            `text-black font-medium ${isActive ? "underline" : ""}`
            }
          >
            Films
          </NavLink>
        </nav>
        
        <div className="flex items-center">
          {authUser ? (
            // Icône pour "Mon compte" si connecté
            <>
              <Link
                to="/mon-compte"
                className="flex items-center justify-center h-full text-black"
              >
                <FaUserCircle size={36} />
                <p className="ml-2">{authUser.email} {authUser.lastname}</p>
              </Link>
              <Link
                to="/logout"
                className="flex items-center justify-center h-full text-black ml-4"
              >
                <FaSignOutAlt size={36} />
              </Link>
            </>
          ) : (
            // Bouton pour "Se connecter / S'inscrire" si non connecté 
            <Link
              to="/login"
              className="flex items-center justify-center h-full text-black"
            >
                <Button text="Se connecter / S'inscrire" />
            </Link>
          )}
        </div>
    </div>
    </header>
  );
};

export default NavDesktop;
