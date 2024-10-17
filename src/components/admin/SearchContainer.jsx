import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

const SearchContainer = ({ data, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelectIngredient = (item) => {
    console.log(`선택된 재료: ${item.name}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <InputWrapper>
        <StyledInput
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
        />
        <SearchButton onClick={() => console.log(`Searching for: ${inputValue}`)}>
          검색
        </SearchButton>
      </InputWrapper>

      <SearchResultTable>
        <thead>
          <tr>
            <th>번호</th>
            <th>재료</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <IngredientTd onClick={() => handleSelectIngredient(item)}>
                {item.name}
              </IngredientTd>
            </tr>
          ))}
        </tbody>
      </SearchResultTable>

      <PaginationWrapper>
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </PaginationWrapper>

      <AddIngredientWrapper>
        <StyledLink to="/admin/ingredient">
          원하는 게 없어요. 직접 추가할래요.
        </StyledLink>
      </AddIngredientWrapper>
    </Container>
  );
};

export default SearchContainer;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px;
  height: 48px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  height: 48px;
  padding: 0 12px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0a800;
  }
`;

const SearchResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    padding: 12px 8px;
    text-align: center;
    height: 48px;
  }

  td:nth-child(1) {
    width: 12.5%;
    text-align: center;
    height: 48px;
  }
`;

const IngredientTd = styled.td`
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 48px;

  &:hover {
    background-color: rgba(0, 123, 255, 0.1); /* 약간 투명한 파란색 */
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const AddIngredientWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  font-size: 0.875rem; /* 작게 표시하기 위해 폰트 크기 설정 */
  color: #1976d2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;