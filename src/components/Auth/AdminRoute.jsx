import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

const AdminRoute = ({ children }) => {
  const { state } = useAuth();

  // 관리자일 경우만 접근 허용
  if (!state.isAuthenticated || state.user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/admin/login" />; // 관리자 로그인 페이지로 리다이렉트
  }

  return children;
};

export default AdminRoute;
