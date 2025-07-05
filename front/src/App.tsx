import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/errors/404";
import AllMoviesPage from "./pages/MoviePage/AllMoviesPage";

import RecipeDetailPage from "./components/RecipeDetailPage";
import AddRecipePage from "./pages/RecipePage/AddRecipePage";
import AllRecipesPage from './components/AllRecipesPage';

import { SearchModalProvider } from "./context/SearchModalContext";
import AccountPage from "./pages/AccountPage/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MovieDetailPage from "./pages/MoviePage/MovieDetailsPage";

// 👇 Appelle simplement useAuthUser au chargement
import { useAuthUser } from "./hooks/query/auth";

function App() {
  // Vérifie si l'utilisateur est authentifié
  // et déclenche la requête pour récupérer les données de l'utilisateur
  useAuthUser(); // Hook pour récupérer l'utilisateur authentifié
  return (
    <SearchModalProvider>
      <div className="min-h-screen flex flex-col">
        <div id="modal-root"></div>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recettes/:id" element={<RecipeDetailPage />} />
            <Route path="/recettes" element={<AllRecipesPage />} />
            <Route path="/films" element={ <AllMoviesPage />} />
            <Route path="/creer-compte" element={<RegisterPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/films/:id" element={<MovieDetailPage />} />
            <Route
              path="/ajouter-recette"
              element={
                <ProtectedRoute>
                  <AddRecipePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mon-compte"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchModalProvider>
  );
}

export default App;