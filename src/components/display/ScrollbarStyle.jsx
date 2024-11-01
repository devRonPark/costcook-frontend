import styled from 'styled-components';

// 스크롤바 스타일링 컴포넌트

export const StyledScrollbar = styled.div`
  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d6d6d6; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모서리 둥글게 */
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 스크롤바 배경 색상 */
    border-radius: 4px; /* 스크롤바 배경의 모서리 둥글게 */
  }
`;
