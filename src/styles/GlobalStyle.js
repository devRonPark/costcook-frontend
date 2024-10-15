// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* 기본 스타일 초기화 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* 테두리 및 패딩 포함 */
  }

  html, body {
    height: 100%; /* 전체 높이 설정 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; /* 기본 폰트 설정 */
  }

  a {
    text-decoration: none; /* 링크의 기본 밑줄 제거 */
    color: inherit; /* 상속받은 색상 사용 */
  }

  ul {
    list-style: none; /* 리스트 스타일 제거 */
  }

  img {
    max-width: 100%; /* 이미지의 최대 너비를 부모 요소에 맞게 설정 */
    height: auto; /* 비율 유지 */
  }
`;

export default GlobalStyle;
