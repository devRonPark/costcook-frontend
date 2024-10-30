import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material'; // Button 컴포넌트 임포트

const StyledButton = styled(IconButton)`
  && {
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: black;
    padding: 0;
    margin-left: 10px; /* 입력 필드와의 간격 추가 */

    /* 모바일 및 데스크톱 반응형 스타일 */
    @media (max-width: 600px) {
      width: 36px; /* 모바일에서 버튼 크기 조정 */
      height: 36px; /* 모바일에서 버튼 크기 조정 */
    }

    &:hover {
      color: orange; /* hover 시 아이콘 색상 */
    }
  }
`;

const SearchButton = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <SearchIcon fontSize="small" /> {/* 아이콘 크기 조절 */}
    </StyledButton>
  );
};

export default SearchButton;
