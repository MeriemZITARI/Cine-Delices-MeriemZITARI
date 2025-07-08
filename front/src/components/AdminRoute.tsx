import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/query/auth";

// Déclare les props attendues : un seul enfant React à afficher si autorisé
interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Appelle le hook pour récupérer l'utilisateur connecté (ou null)
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    // Affiche un message pendant le chargement des données
    return <div>Chargement...</div>;
  }

  if (!authUser || !authUser.isAdmin) {
    // Si l'utilisateur n'est pas connecté ou n'est pas admin, redirige vers l'accueil
    return <Navigate to="/" replace />;
  }

  // Si tout est ok (utilisateur connecté ET admin), rend le composant enfant
  return children;
};

export default AdminRoute;
