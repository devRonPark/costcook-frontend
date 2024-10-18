import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

const SearchContainer = ({ data, placeholder, onSelectIngredient }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const itemsPerPage = 5;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const trimmedInput = inputValue.trim();

    // 검색이 수행되었다는 상태를 설정
    setIsSearchPerformed(true);

    // 입력값이 비어 있거나 공백일 경우 검색 결과가 없도록 설정
    if (trimmedInput === '') {
      setFilteredData([]);
      return;
    }

    // 검색 버튼 클릭 시 데이터 필터링
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(trimmedInput.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // 엔터 키로 검색 실행
    }
  };

  const handleSelectIngredient = (item) => {
    onSelectIngredient(item); // 선택한 재료를 상위 컴포넌트에 전달
    alert(`선택된 재료 ID: ${item.id}`); // 선택된 재료의 ID를 alert로 표시
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  let linkText = '';
  if (isSearchPerformed) {
    linkText =
      filteredData.length > 0
        ? '원하는 게 없어요. 직접 추가할래요.'
        : '검색 결과가 없어요. 직접 추가할래요.';
  }

  return (
    <Container>
      <InputWrapper>
        <StyledInput
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </InputWrapper>

      {isSearchPerformed && filteredData.length > 0 && (
        <>
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

          {filteredData.length > itemsPerPage && (
            <PaginationWrapper>
              <Pagination
                count={Math.ceil(filteredData.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </PaginationWrapper>
          )}
        </>
      )}

      {isSearchPerformed && (
        <AddIngredientWrapper>
          <StyledLink to="/admin/ingredient">{linkText}</StyledLink>
        </AddIngredientWrapper>
      )}
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
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
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
    background-color: rgba(0, 123, 255, 0.1);
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
  font-size: 0.875rem;
  color: #1976d2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;