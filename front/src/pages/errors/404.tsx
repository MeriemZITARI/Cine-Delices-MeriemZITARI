import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-lg mb-6">La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
