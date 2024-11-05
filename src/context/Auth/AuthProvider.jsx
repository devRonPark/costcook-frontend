import { useReducer, useMemo, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { defaultImagePath } from '../../utils/constant';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';

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
        user: {
          ...state.user,
          ...action.payload,
          preferredIngredients: [],
          dislikedIngredients: [],
          nickname: '',
          profileFile: null,
          profileUrl: defaultImagePath,
        },
        isAuthenticated: true,
      };
    case 'SET_AUTH_DATA':
      return {
        ...state,
        user: action.payload, // ableToLogin이 false인 경우의 사용자 데이터 저장
        isAuthenticated: false,
      };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        user: {
          ...state.user, // 기존 user 상태를 유지
          data: {
            ...state.user.data,
            email: action.payload, // 새로운 이메일로 업데이트
          },
        },
      };
    case 'SET_MY_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          id: action.payload.id,
          email: action.payload.sub,
          role: action.payload.role,
          preferredIngredients:
            action.payload.preferredIngredients?.length > 0
              ? action.payload.preferredIngredients
              : [],
          dislikedIngredients:
            action.payload.dislikedIngredients?.length > 0
              ? action.payload.dislikedIngredients
              : [],
          nickname: action.payload.nickname ?? '',
          profileFile: action.payload.profileFile ?? null,
          profileUrl: action.payload.profileUrl ?? defaultImagePath,
        },
        isAuthenticated: true,
      };
    case 'GET_MY_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          preferredIngredients:
            action.payload.preferredIngredients?.length > 0
              ? action.payload.preferredIngredients
              : [],
          dislikedIngredients:
            action.payload.dislikedIngredients?.length > 0
              ? action.payload.dislikedIngredients
              : [],
          nickname: action.payload.nickname ?? '',
          profileFile: action.payload.profileFile ?? null,
          profileUrl: action.payload.profileUrl ?? defaultImagePath,
        },
        isAuthenticated: true,
      };
    case 'UPDATE_MY_INFO':
      const { field, value } = action.payload; // field와 value 추출

      if (field === 'preferredIngredient') {
        // 선호 재료 선택하는 경우
        const { preferredIngredients, dislikedIngredients } = state.user;

        // 기피 재료에 포함되어 있으면 preferredIngredients에 추가하지 않음
        if (dislikedIngredients.some((i) => i === value)) {
          return state; // 변경하지 않고 이전 상태 반환
        }

        // preferredIngredients에 포함되어 있으면 제거
        const updatedPreferredIngredients = preferredIngredients.some(
          (i) => i === value
        )
          ? preferredIngredients.filter((i) => i !== value) // 제거
          : [...preferredIngredients, value]; // 포함되어 있지 않으면 추가

        return {
          ...state,
          user: {
            ...state.user,
            preferredIngredients: updatedPreferredIngredients,
          },
        };
      } else if (field === 'dislikedIngredient') {
        // 기피 재료 선택하는 경우
        const { preferredIngredients, dislikedIngredients } = state.user;

        // 선호 재료에 포함되어 있으면 그대로 유지
        if (preferredIngredients.some((i) => i === value)) {
          return state; // 변경하지 않고 이전 상태 반환
        }

        // dislikedIngredients에 포함되어 있으면 제거
        const updatedDislikedIngredients = dislikedIngredients.some(
          (i) => i === value
        )
          ? dislikedIngredients.filter((i) => i !== value) // 제거
          : [...dislikedIngredients, value]; // 포함되어 있지 않으면 추가
        return {
          ...state,
          user: {
            ...state.user,
            dislikedIngredients: updatedDislikedIngredients,
          },
        };
      }

      // 일반적인 필드 업데이트 처리
      return {
        ...state,
        user: {
          ...state.user,
          [field]: value,
        },
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
  const [cookies, , removeCookie] = useCookies(['accessToken']); // 쿠키 가져오기 및 삭제 함수 추가

  // useEffect를 사용하여 새로 고침 시 사용자 정보를 확인하고 상태 업데이트
  useEffect(() => {
    const checkUserAuthentication = () => {
      const accessToken = cookies.accessToken; // 쿠키에서 access_token 가져오기
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const isExpired = decodedToken.exp * 1000 < Date.now(); // 만료 확인

          if (isExpired) {
            removeCookie('accessToken'); // 만료된 경우 쿠키 삭제
            dispatch({ type: 'LOGOUT' }); // 만료된 경우 로그아웃
          } else {
            dispatch({
              type: 'SET_MY_INFO',
              payload: decodedToken, // JWT에서 사용자 정보 추출
            });
          }
        } catch (error) {
          console.error('JWT 파싱 오류:', error);
          removeCookie('accessToken'); // JWT 파싱 오류 시 쿠키 삭제
          dispatch({ type: 'LOGOUT' }); // JWT 파싱 오류 시 로그아웃
        }
      } else {
        dispatch({ type: 'LOGOUT' }); // 토큰이 없으면 로그아웃
      }
    };

    checkUserAuthentication();
  }, [cookies, removeCookie]); // cookies와 removeCookie 의존성 추가

  // useMemo를 사용하여 value를 메모이제이션
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
