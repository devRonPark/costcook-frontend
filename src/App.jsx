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
import PageTransition from './components/common/PageTransition';
import UserInfo from './pages/UserInfo';
import ItemList from './pages/ItemList';
import Activities from './pages/Activities';
import ProfileUpdate from './pages/ProfileUpdate';
import Review from './pages/Review';
import SignUpComplete from './pages/SignUpComplete';
import RecipeIngredientPage from './pages/admin/RecipeIngredientPage';
import AdminHome from './pages/admin/AdminHome';
import AdminIngredientList from './pages/admin/AdminIngredientList';
import AdminIngredientForm from './pages/admin/IngredientForm';
import AdminRecipeForm from './pages/admin/RecipeForm';
import AdminRecipeList from './pages/admin/RecipeList';
import AdminReviewList from './pages/admin/ReviewList';
import MyReviewPage from './pages/MyReviewPage';

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
          {/* 비회원, 로그인한 회원 모두 접근 가능 */}
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
            path="/recipeDetail/:recipeId"
            element={
              <PageTransition>
                <RecipeDetail />
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
            path="/search"
            element={
              <PageTransition>
                <SearchPage />
              </PageTransition>
            }
          />

          {/* 비회원만 접근 가능 */}
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
            path="/oauth/:provider"
            element={
              <AuthProvider>
                <OAuthVerification />
              </AuthProvider>
            }
          />
          {/* 로그인한 회원만 접근 가능 */}
          <Route path="/profile/update" element={<ProfileUpdate />} />
          <Route path="/signup/complete" element={<SignUpComplete />} />
          <Route
            path="/budget"
            element={
              <PageTransition>
                <BudgetPage />
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
          <Route path="/my/profile" element={<UserInfo />} />
          <Route
            path="/recommend"
            element={
              <PageTransition>
                <RecommendPage />
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
          <Route path="/my/reviews" element={<MyReviewPage />} />

          {/* 관리자만 접근 가능 */}
          <Route path="/admin" element={<AdminHome />} />
          <Route
            path="/admin/ingredient-form"
            element={<AdminIngredientForm />}
          />
          <Route
            path="/admin/ingredient-list"
            element={<AdminIngredientList />}
          />
          <Route 
            path="/admin/recipe-form" 
            element={<AdminRecipeForm />} 
          />
          <Route 
            path="/admin/recipe-ingredient" 
            element={<RecipeIngredientPage />} 
          />
          <Route 
            path="/admin/recipe-list" 
            element={<AdminRecipeList />} 
          />
          <Route
            path="/admin/review-list"
            element={<AdminReviewList/>}
          />
          {/* 아직 명확하지 않은 페이지 */}
          <Route
            path="/list"
            element={
              <PageTransition>
                <ItemList />
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
          {/* 에러 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
