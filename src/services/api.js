import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 API 기본 URL
  withCredentials: true, // 쿠키를 포함해서 요청을 보내도록 설정
});

// 요청 인터셉터 설정 (선택적)
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전 처리가 필요한 경우
    const token = localStorage.getItem('token'); // 예시로 토큰을 localStorage에서 가져옴
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (선택적)
apiClient.interceptors.response.use(
  (response) => {
    // const refreshToken = getCookie('refreshToken');
    // console.log(refreshToken);
    return response; // 응답의 데이터를 반환
  },
  (error) => {
    // 응답 에러 처리
    console.error('응답 에러:', error);
    return Promise.reject(error);
  }
);

export default apiClient; // apiClient를 기본 내보내기
