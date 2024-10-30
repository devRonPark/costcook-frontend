import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import SearchButton from '../components/common/Button/SearchButton';
import { useState } from 'react';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    // 여기에서 검색 API 호출 로직을 작성합니다.
    console.log('검색 API 요청:', keyword);
    // 예: searchRecipes(keyword);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout isBackBtnExist>
      <SearchInputContainer>
        <SearchInput
          type="text"
          placeholder="궁금한 레시피를 검색해 보세요"
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Enter 키 입력 처리 추가
        />
        {/* 검색 버튼 위치 잡아주는 컨테이너 역할 */}
        <SearchButtonWrap onClick={handleSearch}>
          <SearchButton /> {/* 검색 버튼 클릭 시 검색 */}
        </SearchButtonWrap>
      </SearchInputContainer>
      <OutputContainer>
        <h2>최근 검색어</h2>
        <SearchListContainer>
          {/* 검색어가 없으면, List에 최근 검색어가 없어요 라는 단어를 들어간 Data만 출력 */}
          <SearchList>최근 검색어가 없어요</SearchList>
          <SearchList>1</SearchList>
          <SearchList>2</SearchList>
          <SearchList>3</SearchList>
        </SearchListContainer>
      </OutputContainer>
    </Layout>
  );
};

export default SearchPage;

const SearchInputContainer = styled.div`
  width: 100%;
  padding: 0 10px;
  padding-bottom: 10px;
  border-bottom: 2px black solid;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 18px;
  padding: 10px 40px 10px 10px; /* 오른쪽 패딩을 늘려 아이콘과 간격 확보 */
  border: none;
  outline: none;
  border-radius: 5px; /* 모서리 둥글게 */
  background-color: #f9f9f9;

  @media (min-width: 600px) {
    font-size: 20px;
  }
`;

const SearchButtonWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: -50px; /* 아이콘과 입력 필드가 겹치지 않도록 여백 조정 */
`;

const OutputContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column; /* 자식들을 세로로 배치 */
`;

const SearchListContainer = styled.div`
  margin-top: 20px;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px black solid;
  justify-content: center;
  text-align: center;
  flex-direction: column;
`;

const SearchList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 5px;
  border: 1px solid black;
  height: 100px;
  width: 400px;
`;
