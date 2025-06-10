import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../Button/Button";

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          to="/"
          className="text-2xl font-bold font-broadway tracking-wider"
        >
          <img
            src="/path/to/cinedelices_logo.png"
            alt="Ciné Délices Logo"
            className="h-10" // Ajustez la hauteur selon vos besoins
          />
        </Link>
        <nav className="space-x-4">
          <NavLink to="/" className={location.pathname === "/" ? "underline" : ""}>
            Accueil
          </NavLink>
          <NavLink
            to="/recettes"
            className={location.pathname === "/recettes" ? "underline" : ""}
          >
            Recettes
          </NavLink>
        </nav>
      </div>
      <div>
        <Button text="Se connecter / S'inscrire" />
      </div>
    </header>
  );
};

export default Header;