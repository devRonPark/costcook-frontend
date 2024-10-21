import styled from 'styled-components';
import { Button } from '@mui/material';
import Layout from '../components/layout/Layout';

const SearchPage = () => (
  <Layout isBackBtnExist>
    <SearchInputContainer>
      <SearchInput type="text" placeholder="검색어를 입력하세요" />
      {/* <SearchButton /> */}
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

export default SearchPage;

const SearchInputContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  border: 1px black solid;
  text-align: center;
  justify-content: right;
`;

const SearchInput = styled.input`
  width: 80%;
  height: 50px;
  font-size: 25px;
  border: none; /* 모든 테두리 제거 */
  border-bottom: 2px solid black; /* 아래쪽 테두리만 추가 */
  outline: none; /* 포커스 시 기본 외곽선 제거 */
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
