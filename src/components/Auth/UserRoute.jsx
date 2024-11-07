import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

const UserRoute = ({ children }) => {
  const { state } = useAuth();

  // 로그인하지 않았거나, 일반 회원이 아닐 경우 리다이렉트
  if (!state.isAuthenticated || state.user.role !== 'ROLE_USER') {
    return <Navigate to="/login" />; // 로그인 페이지로 리다이렉트
  }

  return children;
};

export default UserRoute;
