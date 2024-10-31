import React from 'react';
import styled from 'styled-components';

const DropdownItemStyled = styled.li`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0; // 호버 시 배경 색상 변경
  }
`;

const DropdownItem = ({ text, onClick }) => {
  return <DropdownItemStyled onClick={onClick}>{text}</DropdownItemStyled>;
};

export default DropdownItem;
