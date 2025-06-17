import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePageMobileFinal from "./pages/HomePage/HomePageNew";
import RecipeDetailPage from "./components/RecipeDetailPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import { SearchModalProvider } from "./context/SearchModalContext";
import TestApi from './components/TestApi';
import NotFoundPage from "./pages/errors/404";

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
            <Route path="/mon-compte" element={<AccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchModalProvider>
  );
}

export default App;