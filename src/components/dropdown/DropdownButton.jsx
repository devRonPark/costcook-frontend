import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styled from 'styled-components';

const DropdownButtonStyled = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8; // 호버 시 투명도 변경
  }
`;

const DropdownButton = ({ onClick }) => {
  return (
    <DropdownButtonStyled onClick={onClick}>
      <MoreHorizIcon />
    </DropdownButtonStyled>
  );
};

export default DropdownButton;
