import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../Button/Button";

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="bg-white text-black py-4 shadow-md flex justify-between">
      <div className="container mx-auto flex items-center flex-start px-4 gap-4">
        <Link
          to="/"
          className="text-2xl font-bold font-broadway tracking-wider"
        >
          <img
            src="/images/logo/logo.png"
            alt="Ciné Délices Logo"
          />
        </Link>
        <nav>
          <NavLink 
            to="/recettes" 
            className={location.pathname === "/recettes" ? "underline" : ""}
          >
            Recettes
          </NavLink>
          <NavLink
            to="/films"
            className={location.pathname === "/films" ? "underline" : ""}
          >
            Films
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