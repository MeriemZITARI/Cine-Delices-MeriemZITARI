import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePage from "./components/HomePage/HomePage";
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

function App() {
  return (
    <SearchModalProvider>
      <div className="min-h-screen flex flex-col">
        <div id="modal-root"></div>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recettes/:id" element={<RecipeDetailPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-recipe" element={<AddRecipePage />} />
            <Route path="/recipes" element={<AllRecipesPage />} />
            <Route
              path="/mon-compte"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="/films" element={ <AllMoviesPage />}  />         
            <Route path="/recettes" element={<Navigate to="/recipes" replace />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/films" element={<AllMoviesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchModalProvider>
  );
}

export default App;