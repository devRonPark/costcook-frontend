import { useReducer, useMemo } from 'react';
import { AuthContext } from './AuthContext';

// 초기 상태
const initialState = {
  user: null,
  isAuthenticated: false,
};

// Reducer 함수
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'SET_AUTH_DATA':
      return {
        ...state,
        user: action.payload, // ableToLogin이 false인 경우의 사용자 데이터 저장
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Provider 생성
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // useMemo를 사용하여 value를 메모이제이션
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
