import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import { ORDER, SORT } from '../utils/sort';
import { FilterDropdownButton } from '../components/common/Button/FilterDropdownButton';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../components/StarRating';
import { formatPrice } from '../utils/formatData';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { StyledScrollbar } from '../components/display/ScrollbarStyle';

const RecipePage = () => {
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [page, setPage] = useState(1); // 현재 페이지
  const { ref, inView } = useInView(); // 로딩 감지용 useRef
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 확인
  const [sort, setSort] = useState(SORT.CREATED_AT); // 디폴트 sort : 생성일
  const [order, setOrder] = useState(ORDER.DESC); // 디폴트 order : 내림차순

  // 데이터 가져오는 메소드
  const fetchData = async () => {
    try {
      const res = await recipeAPI.getRecipeList(page, sort, order);
      if (res.data.recipes.length === 0) {
        setHasMore(false);
        return;
      }
      console.log('페이지 : ', page);

      setRecipeList((prevRecipes) => {
        const myFavorites = sessionStorage.getItem('');
        const newRecipes = res.data.recipes.filter(
          (newRecipe) => !prevRecipes.some((prev) => prev.id === newRecipe.id)
        );
        return [...prevRecipes, ...newRecipes];
      });
      // setRecipeList((prevRecipes) => [...res.data.recipes, ...prevRecipes]);

      console.log(res.data.recipes);
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };

  // 정렬 시 데이터 초기화
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [sort, order]);

  // 스크롤시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  // page 변경될 때마다 호출
  useEffect(() => {
    fetchData();
  }, [page]);

  // 정렬 기능 핸들러
  // 평점 높은 순
  const handleAvgRatingsDesc = () => {
    setSort(SORT.AVG_RATINGS);
    setOrder(ORDER.DESC);
    setPage(1);
    setRecipeList([]);
  };
  // 평점 낮은 순
  const handleAvgRatingsAsc = () => {
    setSort(SORT.AVG_RATINGS);
    setOrder(ORDER.ASC);
    setPage(1);
    setRecipeList([]);
  };
  // 조회수 높은 순
  const handleViewCountSortDesc = () => {
    setSort(SORT.VIEW_COUNT);
    setOrder(ORDER.DESC);
    setPage(1);
    setRecipeList([]);
  };
  // 조회수 낮은 순
  const handleViewCountSortAsc = () => {
    setSort(SORT.VIEW_COUNT);
    setOrder(ORDER.ASC);
    setPage(1);
    setRecipeList([]);
  };
  // 초기화 (생성일, 내림차순)
  const handleResetSort = () => {
    setSort(SORT.CREATED_AT);
    setOrder(ORDER.DESC);
    setPage(1);
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

  return (
    <Layout isBackBtnExist pageName="레시피 전체 목록" isSearchBtnExist>
      <FilterListContainer>
        {/* 드롭다운 정렬버튼 */}
        <FilterDropdownButton handleSortChange={handleSortChange} />
      </FilterListContainer>

      {/* 레시피 목록  Container */}
      <ListRowContainer>
        {recipeList.map((recipe) => (
          <List key={recipe.id}>
            <Link to={`/recipeDetail/${recipe.id}`}>
              <RecipeImageBox>
                <RecipeImage
                  alt={recipe.title}
                  src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                />
              </RecipeImageBox>
            </Link>
            <TitleText>{recipe.title}</TitleText>
            <PriceText>
              {formatPrice(recipe.price / recipe.servings)}원 (1인분)
            </PriceText>
            <StarText>
              <StarRating ratings={recipe.avgRatings} /> ({recipe.avgRatings})
            </StarText>
          </List>
        ))}
        {/* 데이터가 더 있으면 추가 로드 */}
        {hasMore && <p ref={ref}></p>}
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
`;

// 레시피 목록 영역
const ListRowContainer = styled(StyledScrollbar)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
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
  height: 200px; // 220px에서 줄임
  width: 150px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

// 레시피 이미지 영역
const RecipeImageBox = styled.div`
  height: 130px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// 레시피 이미지
const RecipeImage = styled.img`
  width: 100%;
  height: 102%;
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
  font-family: 'GumiRomanceTTF'; // 낭만있구미체
  font-size: 16px;
  opacity: 0.8;
  padding: 2px;
  font-weight: 100;
  margin: 3px 0;
  text-align: center;
  white-space: nowrap; // 한줄 고정
  overflow: hidden; // 넘치면 숨김
  text-overflow: ellipsis; // 넘친 부분 ... 표시
  width: 100%;
`;

// 가격
const PriceText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 11px;
  margin: 3px 0;
`;

// 평점
const StarText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 12px;
  margin: 3px 0;
`;
