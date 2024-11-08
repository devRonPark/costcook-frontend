import axios from 'axios';
import { getCookie } from '../utils/cookieUtil';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REST_SERVER, // 백엔드 API 기본 URL
  withCredentials: true, // 쿠키를 포함해서 요청을 보내도록 설정
});

// 요청 인터셉터 설정 (선택적)
apiClient.interceptors.request.use(
  (config) => {
    const refreshToken = getCookie('refreshToken');
    const accessToken = getCookie('accessToken'); // accessToken 쿠키에서 가져오기
    console.log(refreshToken, accessToken);

    // 새로운 config 객체 생성
    const newConfig = {
      ...config, // 기존 config 속성을 복사
      headers: {
        ...config.headers, // 기존 headers 속성을 복사
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), // accessToken이 있으면 Authorization 헤더 추가
      },
    };

    return newConfig; // 수정된 config 반환
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (선택적)
apiClient.interceptors.response.use(
  (response) => {
    return response; // 응답의 데이터를 반환
  },
  async (err) => {
    const originalReq = err.config;
    if (err.response && err.response.status === 403 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        // 액세스 토큰 재발급 요청
        const refreshResponse = await axios.post(
          'http://localhost:8080/api/auth/token/refresh',
          {},
          { withCredentials: true }
        );
        if (refreshResponse.status === 200) {
          console.log(getCookie('accessToken'));
          originalReq.headers.Authorization = `Bearer ${getCookie(
            'accessToken'
          )}`;
          return apiClient.request(originalReq);
        }
      } catch (refreshError) {
        console.error('액세스 토큰 재발급 실패:', refreshError);
        // 액세스 토큰 쿠키 삭제 처리
      }
    }
    return Promise.reject(err); // 기타 에러 처리
  }
);

export default apiClient; // apiClient를 기본 내보내기
