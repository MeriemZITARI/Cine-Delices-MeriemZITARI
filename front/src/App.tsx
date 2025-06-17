import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePage from "./pages/HomePage/HomePage";
import RecipeDetailPage from "./components/RecipeDetailPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import { SearchModalProvider } from "./context/SearchModalContext";

import NotFoundPage from "./pages/errors/404";
import AddRecipePage from "./components/AddRecipePage";
import AllRecipesPage from './components/AllRecipesPage';
function App() {
  return (
    <SearchModalProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recettes/:id" element={<RecipeDetailPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-recipe" element={<AddRecipePage />} />
            <Route path="/recipes" element={<AllRecipesPage />} />
            <Route path="/recettes" element={<Navigate to="/recipes" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchModalProvider>
  );
}

export default App;