import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePageMobileFinal from "./components/HomePage/HomePageNew";
import RecipeDetailPage from "./components/RecipeDetailPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { SearchModalProvider } from "./context/SearchModalContext";
import TestApi from './components/TestApi';
import NotFoundPage from "./components/errors/404";
import AddRecipePage from "./components/AddRecipePage";

function App() {
  return (
    <SearchModalProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePageMobileFinal />} />
            <Route path="/test-api" element={<TestApi />} />
            <Route path="/recettes/:id" element={<RecipeDetailPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            // ajouter la route pour créer une recette
            <Route path="/add-recipe" element={<AddRecipePage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchModalProvider>
  );
}

export default App;