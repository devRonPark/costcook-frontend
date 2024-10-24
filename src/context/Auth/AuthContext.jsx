import { createContext, useContext } from 'react';

// Context 생성
export const AuthContext = createContext();

// AuthContext 에 대한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
