import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/query/auth";
//import { useAtom } from "jotai";
//import { authUserAtom } from "../store/authUserAtom"; // Importez votre atom

interface ProtectedRouteProps {
  children: React.ReactElement; // Composant à rendre si connecté
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  //const [isAuthenticated] = useAtom(authUserAtom); // Récupère l'état d'authentification depuis l'atom
  const { data: authUser, isLoading } = useAuthUser();

  /*if (!isAuthenticated) {
    // Redirige vers la page de connexion si non connecté
    return <Navigate to="/login" replace />;
  }*/
    if (isLoading) {
      // Optionnel : spinner de chargement
      return <div>Chargement...</div>;
    }
  
    if (!authUser) {
      // Si l'utilisateur n'est pas connecté
      return <Navigate to="/login" replace />;
    }

  // Rend le composant si connecté
  return children;
};

export default ProtectedRoute;