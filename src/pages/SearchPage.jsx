import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import Layout from '../components/layout/Layout';
import SearchButton from '../components/common/Button/SearchButton';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useRef, useState } from 'react';
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
import LoadingComponent from '../components/common/LoadingComponent';
import { useInView } from 'react-intersection-observer'; // Intersection Observer 훅 추가

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(''); // 검색어 상태
  const [searchParams] = useSearchParams();
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false); // 포커스 상태
  const [recentKeywords, setRecentKeywords] = useState([]); // 최근 검색어 상태
  const [searchedRecipes, setSearchedRecipes] = useState(null); // 검색된 레시피 상태
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태
  const { ref: lastRecipeElementRef, inView } = useInView(); // 마지막 레시피 카드 참조 및 뷰 상태

  // 컴포넌트 마운트 시 최근 검색어 가져오기
  useEffect(() => {
    const storedRecentKeywords = getRecentKeywords();
    setRecentKeywords(storedRecentKeywords);
  }, []);

  useEffect(() => {
    const searchByKeyword = async () => {
      // URL에서 검색어 파라미터 가져오기
      const urlKeyword = searchParams.get('keyword');
      if (urlKeyword) {
        setKeyword(urlKeyword);
        await handleSearch(urlKeyword); // URL 검색어로 초기 검색
      }
    };

    searchByKeyword();
  }, [searchParams]);

  const handleInputChange = (event) => {
    setKeyword(event.target.value); // 검색어 변경
  };

  const handleSearch = async (keyword, newPage = 1) => {
    // 검색어가 비어있지 않을 경우 검색
    if (keyword) {
      navigate(`/search?keyword=${keyword}`);
      const updatedKeywords = [...new Set([keyword, ...recentKeywords])]; // 중복 제거
      setRecentKeywords(updatedKeywords);

      setLoading(true); // 로딩 시작
      try {
        const res = await recipeAPI.searchRecipeList({
          keyword,
          page: newPage,
        });
        if (res.status === 200) {
          if (newPage === 1) {
            setSearchedRecipes(res.data.recipes); // 첫 검색 시 레시피 초기화
          } else {
            setSearchedRecipes((prev) => [...prev, ...res.data.recipes]); // 추가 검색 시 덧붙임
          }
          setTotalPages(res.data.totalPages); // 총 페이지 수 업데이트
          saveSearchKeyword(keyword); // 검색어 로컬 스토리지에 저장
        } else {
          showRetryToast(keyword, newPage);
        }
      } catch (err) {
        showRetryToast(keyword, newPage);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };

  // 레시피 검색 API 호출 실패 시 오류 메시지를 표시하는 사용자 정의 Toastify 알림 구현.
  // 사용자에게 이전 검색어와 페이지 번호로 API 호출을 다시 시도할 수 있는 "재시도" 버튼 포함.
  // 사용자 경험 향상을 위해 사용자가 알림을 닫을 때까지 toast 알림이 열려 있도록 설정.
  const showRetryToast = (keyword, newPage) => {
    toast.error(
      <div>
        <span>레시피 검색 중 문제가 발생했습니다. </span>
        <button
          onClick={() => handleSearch(keyword, newPage)}
          style={{ marginLeft: '8px', cursor: 'pointer' }}
        >
          다시 시도
        </button>
      </div>,
      {
        position: 'top-right',
        autoClose: false, // 사용자가 닫기 전까지 유지
        hideProgressBar: true,
        closeOnClick: false, // 클릭 시 자동 닫기 비활성화
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      }
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setPage(1); // 페이지 리셋
      handleSearch(keyword); // 검색 수행
    }
  };

  const handleReset = () => {
    setKeyword(''); // 검색어 리셋
    setSearchedRecipes([]); // 검색 결과 초기화
  };

  const handleKeywordRemove = (keyword) => {
    setRecentKeywords(
      (prevKeywords) => prevKeywords.filter((item) => item !== keyword) // 특정 검색어 제거
    );
    deleteSearchKeyword(keyword); // 로컬 스토리지에서 제거
  };

  const handleAllKeywordsRemove = () => {
    setRecentKeywords([]); // 모든 검색어 제거
    clearAllSearchKeywords(); // 로컬 스토리지 초기화
  };

  const handleKeywordClick = (clickedKeyword) => {
    // 목록에서 제거
    const updatedKeywords = recentKeywords.filter(
      (item) => item !== clickedKeyword
    );

    // 클릭한 검색어를 가장 최근 검색어로 추가
    const newKeywords = [clickedKeyword, ...updatedKeywords];

    setRecentKeywords(newKeywords); // 상태 업데이트
    saveSearchKeyword(clickedKeyword); // 로컬 스토리지에 저장
  };

  // 스크롤시 페이지 증가
  useEffect(() => {
    // 인피니트 스크롤 로직
    // 마지막 레시피 카드가 보이고, 로딩 중이 아닐 때 다음 페이지 검색
    if (inView && !loading && page < totalPages) {
      console.log('다음 페이지 요청');
      setLoading(true); // 로딩 시작
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        handleSearch(keyword, nextPage); // 다음 페이지 검색
        return nextPage; // 페이지 업데이트
      });
    }
  }, [inView, loading, page, totalPages]); // inView와 loading 상태에 따라 의존성 변경

  const NoResultsMessage = () => (
    <div style={{ textAlign: 'center' }}>
      <img
        src="/not_found.png"
        alt="검색된 레시피가 없음"
        width={30}
        height={30}
      />
      <p>검색된 레시피가 없어요</p>
    </div>
  );

  const searchResultRender = () => {
    const hasResults = searchedRecipes.length > 0; // 검색 결과 여부
    return (
      <SearchResultContainer hasResults={hasResults}>
        {hasResults ? (
          <>
            {searchedRecipes.map((recipe, index) => {
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  ref={
                    index === searchedRecipes.length - 1
                      ? lastRecipeElementRef
                      : null
                  } // 마지막 카드에 ref 설정
                />
              );
            })}
            {loading && (
              <LoadingComponent loading={loading} loadingText={'로딩 중...'} />
            )}
          </>
        ) : (
          <NoResultsMessage />
        )}
      </SearchResultContainer>
    );
  };

  const recentlyKeywordRender = () => {
    return (
      <RecentKeywords
        recentKeywords={recentKeywords}
        onRemoveKeyword={handleKeywordRemove}
        onRemoveAllKeywords={handleAllKeywordsRemove}
        onKeywordClick={handleKeywordClick}
      />
    );
  };

  const handleBackBtnClick = () => {
    navigate('/search');
    setSearchedRecipes(null);
    setKeyword(''); // 검색어 리셋
  };

  return (
    <Layout isBackBtnExist onBackClick={handleBackBtnClick}>
      <SearchInputContainer>
        <SearchButtonWrap onClick={handleSearch}>
          <SearchButton
            buttonProps={{
              color:
                keyword.length > 0 || isSearchInputFocused ? 'orange' : 'black',
              hoverColor: 'orange',
              style: { display: keyword.length > 0 ? 'none' : 'flex' },
            }}
          />
        </SearchButtonWrap>
        <SearchInput
          type="text"
          placeholder="궁금한 레시피를 검색해 보세요!"
          value={keyword}
          onChange={handleInputChange}
          onFocus={() => setIsSearchInputFocused(true)} // 입력 필드 포커스
          onBlur={() => setIsSearchInputFocused(false)} // 입력 필드 블러
          onKeyDown={handleKeyDown} // Enter 키 입력 처리
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
  flex-direction: column;
  align-items: center;

  // hasResults가 false일 때의 스타일
  ${(props) =>
    !props.hasResults &&
    css`
      justify-content: center;
      height: 100%;
      color: #757575;
      font-weight: bold;
    `}
`;
