import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

const UserAndGuestRoute = ({ children }) => {
  const { state } = useAuth();

  // 관리자일 경우 리다이렉트
  if (state.isAuthenticated && state.user.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" />; // 관리자 페이지로 리다이렉트
  }

  return children;
};

export default UserAndGuestRoute;
