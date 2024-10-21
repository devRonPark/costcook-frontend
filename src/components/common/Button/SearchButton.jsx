import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material'; // Button 컴포넌트 임포트

const SearchButton = () => (
  <StyledButton>
    <SearchIcon fontSize="large" />
  </StyledButton>
);

export default SearchButton;

const StyledButton = styled(Button)`
  width: 50px; // 버튼의 너비
  height: 50px; // 버튼의 높이
  display: flex; // Flexbox를 사용하여 중앙 정렬
  justify-content: center; // 아이콘 중앙 정렬
  align-items: center; // 아이콘 중앙 정렬
  border-radius: 5px; // 모서리를 부드럽게 하기 위한 옵션
`;
