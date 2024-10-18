import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

const IngredientSearchContainer = ({ data, placeholder, onSearchIngredient, onSelectIngredient }) => {

  /* 상위 컴포넌트(RecipeIngredientPage)로부터 전달되는 props
    1. data: 더미 재료 데이터를 담고 있는 배열.
    2. placeholder: 검색창에 보여줄 힌트 텍스트.
    3. onSearchIngredient: 사용자가 재료를 검색했을 때 호출되는 함수.
    4. onSelectIngredient: 사용자가 재료를 선택했을 때 호출되는 함수. 
  */

  // 상태 : 현재 입력된 키워드
  const [inputValue, setInputValue] = useState('');  
  
  // 상태 : 방금 검색된 결과
  const [filteredData, setFilteredData] = useState([]);

  // 상태 : 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);

  // 상태 : 검색을 수행했는지?
  const [isSearched, setIsSearched] = useState(false);


  // 한 페이지에 보여줄 항목의 개수
  const itemsPerPage = 5;  

  // 현재 페이지에 보여줄 마지막 항목의 인덱스
  const indexOfLastItem = currentPage * itemsPerPage;  

  // 현재 페이지에 보여줄 첫 번째 항목의 인덱스 
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; 

  // 현재 페이지에 보여줄 데이터들
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);  

  // 페이지네이션 밑의 텍스트
  let linkText = '';

  if(isSearched) {
    linkText = filteredData.length > 0 ? '원하는 게 없어요.' : '검색 결과가 없어요.';
    linkText += " 직접 추가할래요.";
  }

  
  // 이벤트 핸들러 : 사용자가 입력창에 값을 입력할 때 실행되는 함수
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 이벤트 핸들러 : 사용자가 검색 버튼을 클릭했을 때 실행되는 함수
  const handleSearch = () => {
    // 입력값의 앞뒤 공백을 제거함.
    const trimmedInput = inputValue.trim();

    // 기존에 선택된 재료를 초기화함.
    onSelectIngredient(null);

    // 검색이 수행되었음
    setIsSearched(true);

    // 입력값이 공백일 경우 검색되지 않음.
    if (trimmedInput === '') {
      setFilteredData([]);
      return;
    }

    // 특정 키워드를 포함한 재료만 필터링함.
    // 현재 더미 데이터를 이용하고 있음.
    const result = data.filter((item) =>
      item.name.toLowerCase().includes(trimmedInput.toLowerCase())
    );

    // 검색 결과를 저장함.
    setFilteredData(result);

    // 현재 페이지를 첫 번째 페이지로 설정함.
    setCurrentPage(1);

    // 상위 컴포넌트에 검색 결과 전달
    onSearchIngredient(trimmedInput, result);
  };

  // 이벤트 핸들러 : 사용자가 "Enter" 키를 눌렀을 때 실행되는 함수
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 이벤트 핸들러 : 사용자가 특정 재료를 선택했을 때 실행되는 함수
  const handleSelectIngredient = (item) => {
    // 선택한 재료를 상위 컴포넌트에 전달함.
    onSelectIngredient(item); 
  };

  // 이벤트 핸들러 : 페이지네이션 번호를 클릭했을 때 실행되는 함수
  const handlePageChange = (event, value) => {
    // 클릭한 페이지 번호로 업데이트함.
    setCurrentPage(value);
  };

  
  return (
    <Container>

      {/* 입력창 및 검색 버튼 */}
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

      {/* 검색 결과가 있을 때만 테이블을 보여줌 */}
      {isSearched && filteredData.length > 0 && (
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

          {/* 검색 결과가 itemsPerPage보다 많으면 페이지네이션을 보여줌 */}
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

      {/* 재료 추가 페이지로 이동하는 링크 */}
      <AddIngredientLink to="/admin/ingredient">
        {linkText}
      </AddIngredientLink>
    </Container>
  );
};

export default IngredientSearchContainer;


// 전체 영역
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 입력창과 검색 버튼을 담고 있는 영역
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

// 입력창
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

// 검색 버튼
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
    background-color: #e0a800;  // 배경 색상이 더 짙어짐
  }
`;

// 검색 결과를 보여줄 테이블
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

// 재료 이름을 나타내는 칸
const IngredientTd = styled.td`
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 48px;

  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

// 페이지네이션 영역
const PaginationWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

// 재료 추가 페이지로 이동하는 링크
const AddIngredientLink = styled(Link)`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  font-size: 0.875rem;
  color: #1976d2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;