import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <Routes>
        <Route path="/" element={<PreLoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
