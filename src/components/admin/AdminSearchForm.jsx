import React from 'react';
import styled from 'styled-components';

const AdminSearchForm = ({
  inputCategory,
  handleCategoryChange,
  categories,
  inputKeyword,
  handleKeywordChange,
  handleSearchSubmit,
}) => {
  return (
    <SearchForm onSubmit={handleSearchSubmit}>
      <CategorySelect value={inputCategory} onChange={handleCategoryChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </CategorySelect>

      <SearchInput
        type="text"
        value={inputKeyword}
        onChange={handleKeywordChange}
        placeholder="검색어를 입력하세요..."
      />
      <SearchButton type="submit">검색</SearchButton>
    </SearchForm>
  );
};

export default AdminSearchForm;

// 스타일 정의
const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const CategorySelect = styled.select`
  padding: 10px 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  width: 80px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23555"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 2px center;
  background-color: white;
  background-size: 20px;
`;

const SearchInput = styled.input`
  width: 260px; 
  padding: 12px; 
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
