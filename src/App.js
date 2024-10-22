import { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from './styles/GlobalStyle';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import BudgetPage from './pages/BudgetPage';
import MyPage from './pages/MyPage';
import FavoritePage from './pages/FavoritePage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import PreLoginPage from './pages/PreLoginPage';
import OAuthVerification from './pages/OAuthVerification';
import { AuthProvider } from './context/Auth/AuthProvider';
import RecommendPage from './pages/RecommendPage';
import RecipeDetail from './pages/RecipeDetail';
import AdminRecipePage from './pages/admin/RecipePage';
import AdminIngredientPage from './pages/admin/IngredientPage';
import PageTransition from './components/common/PageTransition';
import RecipeIngredientPage from './pages/admin/RecipeIngredientPage';
import { useAuth } from './context/Auth/AuthContext';
import UserInfo from './pages/UserInfo';
import ItemList from './pages/ItemList';
import Activities from './pages/Activities';
import Review from './pages/Review';


function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ToastContainer
        position="bottom-center" // 위치 설정
      />
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <PreLoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/home"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/recipe"
            element={
              <PageTransition>
                <RecipePage />
              </PageTransition>
            }
          />
          <Route
            path="/recipeDetail"
            element={
              <PageTransition>
                <RecipeDetail />
              </PageTransition>
            }
          />
          <Route
            path="/recommend"
            element={
              <PageTransition>
                <RecommendPage />
              </PageTransition>
            }
          />
          <Route
            path="/budget"
            element={
              <PageTransition>
                <BudgetPage />
              </PageTransition>
            }
          />
          <Route
            path="/favorite"
            element={
              <PageTransition>
                <FavoritePage />
              </PageTransition>
            }
          />
          <Route
            path="/my"
            element={
              <PageTransition>
                <MyPage />
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <SearchPage />
              </PageTransition>
            }
          />
          <Route
            path="/list"
            element={
              <PageTransition>
                <ItemList />
              </PageTransition>
            }
          />
          <Route
            path="/activities"
            element={
              <PageTransition>
                <Activities />
              </PageTransition>
            }
          />
          <Route
            path="/review"
            element={
              <PageTransition>
                <Review />
              </PageTransition>
            }
          />
          <Route
            path="/oauth/:provider"
            element={
              <AuthProvider>
                <OAuthVerification />
              </AuthProvider>
            }
          />
          <Route 
            path="/admin/ingredient" 
            element={<AdminIngredientPage />} 
          />
          <Route 
            path="/admin/recipe" 
            element={<AdminRecipePage />} 
          />
          <Route path="/users/me" element={<UserInfo />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
