import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

const PublicRoute = ({ children }) => {
  const { state } = useAuth();

  // 로그인 상태인 경우 리다이렉트
  if (state.isAuthenticated) {
    return <Navigate to="/home" />; // 홈 페이지로 리다이렉트
  }

  return children;
};

export default PublicRoute;
