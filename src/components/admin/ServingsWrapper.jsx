import React from 'react';
import styled from 'styled-components';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ServingsWrapper = ({ value, onChange }) => {
  return (
    <Wrapper>
      <StyledSelect value={value} onChange={onChange}>
        {[1, 2, 3, 4].map((num) => (
          <option key={num} value={num}>
            {num}인분
          </option>
        ))}
      </StyledSelect>
      <ArrowIconWrapper>
        <ArrowDropDownIcon fontSize="large" />
      </ArrowIconWrapper>
    </Wrapper>
  );
};

export default ServingsWrapper;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 48px; /* 높이 고정 */
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  appearance: none; /* 기본 화살표 아이콘 제거 */
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ArrowIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  pointer-events: none; /* 아이콘에 클릭 이벤트가 전달되지 않도록 함 */
  color: #ccc;

  svg {
    font-size: 2rem; /* 아이콘 크기 설정 (기본값보다 더 크게 설정) */
  }
`;