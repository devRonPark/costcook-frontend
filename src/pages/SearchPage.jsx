import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import SearchButton from '../components/common/Button/SearchButton';
import ClearIcon from '@mui/icons-material/Clear'; // 리셋 아이콘 추가
import { useEffect, useState } from 'react';
import {
  clearAllSearchKeywords,
  deleteSearchKeyword,
  getRecentKeywords,
  saveSearchKeyword,
} from '../utils/searchRecipe';
import { IconButton } from '@mui/material';
import { recipeAPI } from '../services/recipe.api';
import RecipeCard from '../components/display/RecipeCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RecentKeywords from '../components/RecentKeywords';

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [searchParams] = useSearchParams();
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false); // 포커스 상태 관리
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [searchedRecipes, setSearchedRecipes] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 최근 검색어를 가져옴
    const storedRecentKeywords = getRecentKeywords();
    setRecentKeywords(storedRecentKeywords);
  }, []);

  useEffect(() => {
    const searchByKeyword = async () => {
      // URL에서 keyword 파라미터 가져와 초기 검색어로 설정
      const urlKeyword = searchParams.get('keyword');
      if (urlKeyword) {
        setKeyword(urlKeyword);
        await handleSearch(urlKeyword); // URL에 있는 검색어로 초기 검색 수행
      }
    };

    searchByKeyword();
  }, [searchParams]);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async (keyword) => {
    // keyword가 비어 있을 때 검색 API 호출 방지
    if (keyword) {
      navigate(`/search?keyword=${keyword}`);

      // 최근 검색어 추가
      const updatedKeywords = [...new Set([keyword, ...recentKeywords])]; // 중복 방지
      setRecentKeywords(updatedKeywords);
      const res = await recipeAPI.searchRecipeList({ keyword, page: 1 });
      if (res.status === 200) {
        setSearchedRecipes(res.data.recipes);
        // 검색어는 로컬 스토리지에 저장.
        saveSearchKeyword(keyword);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  const handleReset = () => {
    setKeyword(''); // 검색어 리셋
  };

  const handleKeywordRemove = (keyword) => {
    console.log(`삭제 대상 검색어: ${keyword}`);
    setRecentKeywords((prevKeywords) =>
      prevKeywords.filter((item) => item !== keyword)
    ); // 특정 검색어 제거
    deleteSearchKeyword(keyword);
  };

  const handleAllKeywordsRemove = () => {
    setRecentKeywords([]);
    clearAllSearchKeywords();
  };

  const searchResultRender = () => {
    if (searchedRecipes.length === 0) {
      return (
        <SearchResultContainer>
          {`${keyword} 에 대한 검색 결과가 존재하지 않습니다.`}
        </SearchResultContainer>
      );
    }
    return (
      <SearchResultContainer>
        {searchedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </SearchResultContainer>
    );
  };
  const recentlyKeywordRender = () => {
    return (
      <RecentKeywords
        recentKeywords={recentKeywords}
        onRemoveKeyword={handleKeywordRemove}
        onRemoveAllKeywords={handleAllKeywordsRemove}
      />
    );
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
        {searchedRecipes === null
          ? recentlyKeywordRender()
          : searchResultRender()}
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

// 레시피 목록 영역
const SearchResultContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px black solid;
  flex-wrap: wrap;
  max-height: 80vh;
  overflow-y: auto;
`;
