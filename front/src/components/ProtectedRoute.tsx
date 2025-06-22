import React from "react";
import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/authUserAtom"; // Importez votre atom

interface ProtectedRouteProps {
  children: React.ReactElement; // Composant à rendre si connecté
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated] = useAtom(authUserAtom); // Récupère l'état d'authentification depuis l'atom

  if (!isAuthenticated) {
    // Redirige vers la page de connexion si non connecté
    return <Navigate to="/login" replace />;
  }

  // Rend le composant si connecté
  return children;
};

export default ProtectedRoute;