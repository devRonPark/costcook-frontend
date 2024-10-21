import React from 'react';
import styled from 'styled-components';
import ArrowBack from '@mui/icons-material/ArrowBack';
import IconButton from './IconButton';

const BackButtonContainer = styled(IconButton)`
  border-radius: 50%; /* 둥근 모서리 */
  background-color: black; /* 배경 색상 */
  color: white; /* 아이콘 색상 */
  transition: background-color 0.3s;
  &:hover {
    background-color: #444; /* hover 시 색상 변경 */
  }
`;

// 버튼 컴포넌트
const BackButton = ({ onClick }) => {
  return <BackButtonContainer onClick={onClick} IconComponent={ArrowBack} />;
};

export default BackButton;
