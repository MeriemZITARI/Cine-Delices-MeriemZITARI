import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="bg-black text-white py-4 shadow-md">
    <div className="container mx-auto flex items-center justify-between px-4">
      <Link to="/" className="text-2xl font-bold font-broadway tracking-wider">
        Ciné Délices
      </Link>
      <nav className="space-x-4">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        <Link to="/recettes" className="hover:text-primary">
          Recettes
        </Link>
      </nav>
    </div>
  </header>
);


export default Header;