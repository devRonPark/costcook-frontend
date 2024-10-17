import apiClient from './api'; // apiClient를 임포트

// AuthApi 객체
const AuthApi = {
  // OAuth 인증 코드로 사용자 정보 요청
  getProviderInfo: (provider, code) =>
    apiClient.get(`/oauth/${provider}?code=${code}`), // 사용자 정보 요청
  // 회원가입 및 로그인 처리
  signUpOrLogin: (data) => apiClient.post(`/auth/signup-or-login`, data),
  // 로그아웃 요청 (선택적)
  logout: async () => {
    return apiClient.post('/auth/logout'); // 로그아웃 요청
  },
  sendVerificationEmail: (data) =>
    apiClient.post('/auth/send-verification-code', data),
};

export default AuthApi; // AuthApi 객체를 기본 내보내기
