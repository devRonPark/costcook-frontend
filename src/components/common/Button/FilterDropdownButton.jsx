import React from 'react';
import styled from 'styled-components';

export const FilterDropdownButton = ({ value, options, handleSortChange }) => {
  return (
    <DropdownContainer>
      <StyledSelect onChange={handleSortChange} value={value}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </StyledSelect>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const StyledSelect = styled.select`
  font-family: 'GmarketSansMedium';
  font-size: 14px;
  border: 0px solid white;
  border-radius: 4px;
  background-color: white;
  color: black;
`;
