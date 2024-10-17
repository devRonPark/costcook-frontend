import React from 'react';
import styled from 'styled-components';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BackButtonContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px; /* 원하는 버튼 크기로 조정 */
  height: 35px; /* 원하는 버튼 크기로 조정 */
  border: none;
  border-radius: 50%; /* 둥근 모서리 */
  background-color: black; /* 배경 색상 */
  color: white; /* 아이콘 색상 */
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444; /* hover 시 색상 변경 */
  }
`;

// 버튼 컴포넌트
const BackButton = ({ onClick }) => {
  return (
    <BackButtonContainer onClick={onClick}>
      <ArrowBack />
    </BackButtonContainer>
  );
};

export default BackButton;
