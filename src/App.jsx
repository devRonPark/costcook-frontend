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
import ProfileUpdate from './pages/ProfileUpdate';
import SignUpComplete from './pages/SignUpComplete';
import RecipeIngredientPage from './pages/admin/RecipeIngredientPage';
import AdminHome from './pages/admin/AdminHome';
import AdminLogin from './pages/admin/AdminLogin';
import AdminIngredientList from './pages/admin/IngredientList';
import AdminIngredientForm from './pages/admin/IngredientForm';
import AdminRecipeForm from './pages/admin/RecipeForm';
import AdminRecipeList from './pages/admin/RecipeList';
import AdminReviewList from './pages/admin/ReviewList';
import MyReviewPage from './pages/MyReviewPage';
import WeeklyDetail from './pages/WeeklyDetail';
import PublicRoute from './components/Auth/PublicRoute';
import UserAndGuestRoute from './components/Auth/UserAndGuestRoute';
import AllUserRoute from './components/Auth/AllUserRoute';
import UserRoute from './components/Auth/UserRoute';
import AdminRoute from './components/Auth/AdminRoute';

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        theme="light"
      />
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 비회원, 로그인한 회원(사용자, 관리자) 모두 접근 가능 */}
          {/* 홈 화면 */}
          <Route
            path="/home"
            element={
              <PageTransition>
                <AllUserRoute>
                  <HomePage />
                </AllUserRoute>
              </PageTransition>
            }
          />
          {/* 레시피 목록 화면 */}
          <Route
            path="/recipes"
            element={
              <PageTransition>
                <AllUserRoute>
                  <RecipePage />
                </AllUserRoute>
              </PageTransition>
            }
          />
          {/* 레시피 상세정보 화면 */}
          <Route
            path="/recipes/:recipeId"
            element={
              <PageTransition>
                <AllUserRoute>
                  <RecipeDetail />
                </AllUserRoute>
              </PageTransition>
            }
          />
          {/* 레시피 즐겨찾기 목록 화면 */}
          <Route
            path="/recipes/favorites"
            element={
              <PageTransition>
                <UserAndGuestRoute>
                  <FavoritePage />
                </UserAndGuestRoute>
              </PageTransition>
            }
          />
          {/* 레시피 검색 화면 */}
          <Route
            path="/recipes/search"
            element={
              <PageTransition>
                <AllUserRoute>
                  <SearchPage />
                </AllUserRoute>
              </PageTransition>
            }
          />
          {/* 레시피 추천 화면 */}
          <Route
            path="/recipes/recommend"
            element={
              <PageTransition>
                <UserAndGuestRoute>
                  <RecommendPage />
                </UserAndGuestRoute>
              </PageTransition>
            }
          />
          {/* 비회원만 접근 가능 */}
          {/* 시작 화면 */}
          <Route
            path="/"
            element={
              <PageTransition>
                <PublicRoute>
                  <PreLoginPage />
                </PublicRoute>
              </PageTransition>
            }
          />
          {/* 로그인 화면 */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              </PageTransition>
            }
          />
          {/* 소셜 로그인 진행 중 화면(이메일 인증, 인증번호 입력 포함) */}
          <Route
            path="/oauth/:provider"
            element={
              <AuthProvider>
                <PublicRoute>
                  <OAuthVerification />
                </PublicRoute>
              </AuthProvider>
            }
          />
          {/* 로그인한 회원만 접근 가능 */}
          {/* 사용자 프로필 세팅 화면 */}
          <Route
            path="/profile-setup"
            element={
              <UserRoute>
                <ProfileUpdate />
              </UserRoute>
            }
          />
          {/* 사용자 프로필 세팅 완료 화면 */}
          <Route
            path="/profile-setup/complete"
            element={
              <UserRoute>
                <SignUpComplete />
              </UserRoute>
            }
          />
          {/* 사용자 예산 내역 화면 */}
          <Route
            path="/budget-history"
            element={
              <PageTransition>
                <UserRoute>
                  <BudgetPage />
                </UserRoute>
              </PageTransition>
            }
          />
          {/* 마이 페이지 화면 */}
          <Route
            path="/my"
            element={
              <PageTransition>
                <UserRoute>
                  <MyPage />
                </UserRoute>
              </PageTransition>
            }
          />
          {/* 내가 작성한 리뷰 내역 화면 */}
          <Route
            path="/my/reviews"
            element={
              <UserRoute>
                <MyReviewPage />
              </UserRoute>
            }
          />
          {/* 각 주차 별 추천 및 사용한 레시피 내역 화면 */}
          <Route path="/weekly-details" element={<WeeklyDetail />} />

          {/* 관리자만 접근 가능 */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <AdminRoute>
                <AdminLogin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ingredient-form"
            element={
              <AdminRoute>
                <AdminIngredientForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ingredient-list"
            element={
              <AdminRoute>
                <AdminIngredientList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/recipe-form"
            element={
              <AdminRoute>
                <AdminRecipeForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/recipe-ingredient"
            element={
              <AdminRoute>
                <RecipeIngredientPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/recipe-list"
            element={
              <AdminRoute>
                <AdminRecipeList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/review-list"
            element={
              <AdminRoute>
                <AdminReviewList />
              </AdminRoute>
            }
          />
          {/* 에러 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
