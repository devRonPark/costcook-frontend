import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import SearchButton from '../components/common/Button/SearchButton';
import ClearIcon from '@mui/icons-material/Clear'; // 리셋 아이콘 추가
import { useEffect, useState } from 'react';
import { getRecentKeywords, saveSearchKeyword } from '../utils/searchRecipe';
import { IconButton } from '@mui/material';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false); // 포커스 상태 관리
  const [recentKeywords, setRecentKeywords] = useState([]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 최근 검색어를 가져옴
    const storedRecentKeywords = getRecentKeywords();
    setRecentKeywords(storedRecentKeywords);
  }, []);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    console.log('검색 API 요청:', keyword);

    if (keyword) {
      // 검색어 추가
      const updatedSearches = [...new Set([keyword, ...recentKeywords])]; // 중복 방지
      setRecentKeywords(updatedSearches);
      // 검색어는 로컬 스토리지에 저장.
      saveSearchKeyword(keyword);
      setKeyword(''); // 검색 후 입력 필드 초기화
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setKeyword(''); // 검색어 리셋
  };

  return (
    <Layout isBackBtnExist>
      <SearchInputContainer>
        {/* 검색 버튼 위치 잡아주는 컨테이너 역할 */}
        <SearchButtonWrap onClick={handleSearch}>
          <SearchButton
            buttonProps={{
              color:
                keyword.length > 0 || isSearchInputFocused ? 'orange' : 'black',
              hoverColor: 'orange',
              style: { display: keyword.length > 0 ? 'none' : 'flex' },
            }}
          />{' '}
          {/* 검색 버튼 클릭 시 검색 */}
        </SearchButtonWrap>
        <SearchInput
          type="text"
          placeholder="궁금한 레시피를 검색해 보세요!"
          value={keyword}
          onChange={handleInputChange}
          onFocus={() => setIsSearchInputFocused(true)} // 인풋 포커스 시 상태 변경
          onBlur={() => setIsSearchInputFocused(false)} // 인풋 블러 시 상태 변경
          onKeyDown={handleKeyDown} // Enter 키 입력 처리 추가
        />
        <ResetButton onClick={handleReset} show={keyword.length > 0}>
          <ClearIcon fontSize="small" />
        </ResetButton>
      </SearchInputContainer>
      <OutputContainer>
        <h2>최근 검색어</h2>
        <SearchListContainer>
          {/* 검색어가 없으면, List에 최근 검색어가 없어요 라는 단어를 들어간 Data만 출력 */}
          {recentKeywords.length === 0 ? (
            <SearchList>최근 검색어가 없어요</SearchList>
          ) : (
            recentKeywords.map((recentKeyword, index) => (
              <SearchList key={index}>{recentKeyword}</SearchList>
            ))
          )}
        </SearchListContainer>
      </OutputContainer>
    </Layout>
  );
};

export default SearchPage;

const SearchInputContainer = styled.div`
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 2px solid orange; /* 주황색 테두리 */
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 18px;
  padding: 10px 10px; /* 검색 버튼 공간을 감안해 왼쪽 패딩만 설정 */
  border: none;
  outline: none;
  border-radius: 5px; /* 모서리 둥글게 */
  background-color: white; /* 배경색 흰색 */

  @media (min-width: 600px) {
    font-size: 20px;
  }
`;

const SearchButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled(IconButton)`
  && {
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: black;
    padding: 0;
    margin-left: 10px; /* 입력 필드와의 간격 추가 */

    /* 모바일 및 데스크톱 반응형 스타일 */
    @media (max-width: 600px) {
      width: 36px; /* 모바일에서 버튼 크기 조정 */
      height: 36px; /* 모바일에서 버튼 크기 조정 */
    }

    &:hover {
      color: orange; /* hover 시 아이콘 색상 */
    }
  }
`;

const ResetButton = styled(StyledButton)`
  position: absolute; /* 인풋 필드 내에서 위치 고정 */
  right: 10px; /* 인풋 필드 우측 여백 */
  display: ${(props) =>
    props.show
      ? 'flex'
      : 'none'} !important; /* 검색어가 있을 때만 보이도록 설정 */
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
