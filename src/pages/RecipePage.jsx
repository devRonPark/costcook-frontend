import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Layout from '../components/layout/Layout';
import { ORDER, SORT } from '../utils/sort';
import { FilterDropdownButton } from '../components/common/Button/FilterDropdownButton';

const RecipePage = () => {
  const navigate = useNavigate();
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [page, setPage] = useState(0); // 현재 페이지
  const { ref, inView } = useInView(); // 로딩 감지용 useRef
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 확인
  const [sort, setSort] = useState(SORT.CREATED_AT); // 디폴트 sort : 생성일
  const [order, setOrder] = useState(ORDER.DESC); // 디폴트 order : 내림차순

  // 데이터 가져오는 메소드
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/recipes?page=${page}&size=9&sort=${sort}&order=${order}`
      );
      if (res.data.recipes.length === 0) {
        console.log('더 이상 불러올 데이터가 없습니다.');
        setHasMore(false);
        return;
      }
      // 중복 레시피 제거 후 상태 업데이트
      // setRecipeList((prevRecipes) => [...prevRecipes, ...res.data.recipes]) // 새로운 레시피 추가
      setRecipeList((prevRecipes) => {
        const newRecipes = res.data.recipes.filter(
          (newRecipe) => !prevRecipes.some((prev) => prev.id === newRecipe.id)
        );
        return [...prevRecipes, ...newRecipes];
      });
      console.log(res.data.recipes);
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };

  // 스크롤시 페이지 변경
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [sort, order]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  useEffect(() => {
    fetchData();
  }, [page]); // page 변경될 때마다 호출

  // 정렬 기능 핸들러
  // 평점 높은 순
  const handleAvgRatingsDesc = () => {
    setSort(SORT.AVG_RATINGS);
    setOrder(ORDER.DESC);
    setPage(0);
    setRecipeList([]);
  };
  // 평점 낮은 순
  const handleAvgRatingsAsc = () => {
    setSort(SORT.AVG_RATINGS);
    setOrder(ORDER.ASC);
    setPage(0);
    setRecipeList([]);
  };
  // 조회수 높은 순
  const handleViewCountSortDesc = () => {
    setSort(SORT.VIEW_COUNT);
    setOrder(ORDER.DESC);
    setPage(0);
    setRecipeList([]);
  };
  // 조회수 낮은 순
  const handleViewCountSortAsc = () => {
    setSort(SORT.VIEW_COUNT);
    setOrder(ORDER.ASC);
    setPage(0);
    setRecipeList([]);
  };
  // 초기화 (생성일, 내림차순)
  const handleResetSort = () => {
    setSort(SORT.CREATED_AT);
    setOrder(ORDER.DESC);
    setPage(0);
    setRecipeList([]);
    console.log('정렬 초기화');
  };
  // 정렬 콘솔 로그 출력
  useEffect(() => {
    console.log('정렬 기준 : ', sort, order);
  }, [sort, order]);

  // 정렬 드롭다운 버튼 핸들러
  const handleSortChange = (e) => {
    const selectedValue = e.target.value;

    switch (selectedValue) {
      case 'createdAt':
        handleResetSort();
        break;
      case 'avgRatingsDesc':
        handleAvgRatingsDesc();
        break;
      case 'avgRatingsAsc':
        handleAvgRatingsAsc();
        break;
      case 'viewCountDesc':
        handleViewCountSortDesc();
        break;
      case 'viewCountAsc':
        handleViewCountSortAsc();
        break;
      default:
        break;
    }
  };

  // 평점 0 ~ 5 분기처리 ★☆☆☆☆ : 우선 (int) avgRatings 값에 따라 표기(소수점 버림)
  const renderStars = (ratings) => {
    const intStars = Math.floor(ratings); // 소수점 버림
    const stars = [
      ...Array.from({ length: intStars }, () => '★'), // 별 채우기
      ...Array.from({ length: 5 - intStars }, () => '☆'), // 빈 별
    ];
    return stars.join(''); // 배열을 문자열로 결합
  };

  return (
    <Layout isBackBtnExist pageName="레시피 전체 목록" isRecipeListPage>
      <FilterListContainer>
        {/* 드롭다운 정렬버튼 */}
        <FilterDropdownButton handleSortChange={handleSortChange} />
      </FilterListContainer>

      {/* 레시피 목록  Container */}
      <ListRowContainer>
        {recipeList.map((recipe) => (
          // thumbnailUrl가 아래값처럼 되어있는 경우 이미지경로 추출(수정 예정)
          // C:\Users\WD\Desktop\costcook-image\b09047ad-ba5e-4773-9f14-e31d44295ad8_망고요거트스무디.jpg
          // console.log(`http://localhost:8080/img/${imageName}`);

          <List key={recipe.id}>
            <a href={`http://localhost:8080/api/recipes/${recipe.id}`}>
              <RecipeImageBox>
                {/* <img style={{width:'90%'}} alt={recipe.title} src={`http://localhost:8080/img/${recipe.thumbnailUrl?.split('\\').pop()}`}/> */}
                <RecipeImage
                  alt={recipe.title}
                  src={`http://localhost:8080/img/${recipe.thumbnailUrl}.jpg`}
                />
              </RecipeImageBox>
            </a>
            <TitleText>{recipe.title}</TitleText>
            <PriceText>{recipe.price}원</PriceText>
            <StarText>
              {renderStars(recipe.avgRatings)} ({recipe.avgRatings}점)
            </StarText>
          </List>
        ))}
        <LoadingBox>
          {hasMore ? (
            <p ref={ref}>로딩 중...</p>
          ) : (
            <p>더 이상 불러올 데이터가 없습니다.</p>
          )}
        </LoadingBox>
      </ListRowContainer>
    </Layout>
  );
};

export default RecipePage;

// 정렬 버튼 영역
const FilterListContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  border: 1px black solid;
  /* border-radius: 10px 10px 0px 0px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4); */
`;

// 레시피 목록 영역
const ListRowContainer = styled.div`
  width: 100%;
  /* height: 250px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px black solid;
  flex-wrap: wrap;
  max-height: 80vh;
  overflow-y: auto;
`;

// 레시피 하나 영역
const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  /* border: 1px solid black; */
  height: 200px; // 220px에서 줄임
  width: 120px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

// 레시피 이미지 영역
const RecipeImageBox = styled.div`
  height: 120px;
  width: 120px;
  /* border-bottom: 1px black solid; */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// 레시피 이미지
const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px 10px 0px 0px;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px 5px;
  text-align: left;
`;

// 레시피 이름
const TitleText = styled.h3`
  font-size: 16px;
  margin: 3px 0;
  text-align: center;
  white-space: nowrap; // 한줄 고정
  overflow: hidden; // 넘치면 숨김
  text-overflow: ellipsis; // 넘친 부분 ... 표시
  width: 100%;
`;

// 가격
const PriceText = styled.a`
  font-size: 12px;
  margin: 3px 0;
`;

// 평점
const StarText = styled.a`
  font-size: 12px;
  margin: 3px 0;
`;

// 데이터 추가 로드 시 하단 로딩 텍스트 영역
const LoadingBox = styled.div`
  width: 100%;
  text-align: center;
  margin: 10px;
`;
