import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FilterDropdownButton } from '../components/common/Button/FilterDropdownButton';
import {
  FilterListContainer,
  List,
  ListRowContainer,
  PriceText,
  RecipeImage,
  RecipeImageBox,
  StarText,
  TitleText,
} from '../components/display/RecipeListStyle';
import Layout from '../components/layout/Layout';
import { StarRating } from '../components/StarRating';
import { recipeAPI } from '../services/recipe.api';
import { formatPrice } from '../utils/formatData';
import { ORDER, SORT } from '../utils/sort';

const RecipePage = () => {
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [page, setPage] = useState(1); // 현재 페이지
  const { ref, inView } = useInView(); // 로딩 감지용 useRef
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 확인
  const [sort, setSort] = useState(SORT.CREATED_AT); // 정렬 기준 (기본: 생성일)
  const [order, setOrder] = useState(ORDER.DESC); // 정렬 순서 (기본: 내림차순)

  // 데이터 가져오는 메소드
  const fetchData = async () => {
    try {
      const res = await recipeAPI.getRecipeList(page, sort, order);
      if (res.data.recipes.length === 0) {
        setHasMore(false);
        return;
      }
      if (page === 1) {
        setRecipeList(res.data.recipes);
      }
      setRecipeList((prevRecipes) => {
        const myFavorites = sessionStorage.getItem('');
        const newRecipes = res.data.recipes.filter(
          (newRecipe) => !prevRecipes.some((prev) => prev.id === newRecipe.id)
        );
        return [...prevRecipes, ...newRecipes];
      });
      // setRecipeList((prevRecipes) => [...res.data.recipes, ...prevRecipes]);
      console.log('출력된 데이터 : ', res.data.recipes);
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };
  // 스크롤시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  // page 변경될 때마다 호출
  useEffect(() => {
    fetchData();
  }, [page, sort, order]);

  // 정렬 기능 핸들러
  const handleSort = (sort, order) => {
    setSort(sort);
    setOrder(order);
    setPage(1);
    setRecipeList([]);
  };

  // 정렬 드롭다운 버튼 핸들러
  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    switch (selectedValue) {
      case 'createdAt':
        handleSort(SORT.CREATED_AT, ORDER.DESC);
        break;
      case 'avgRatingsDesc':
        handleSort(SORT.AVG_RATINGS, ORDER.DESC);
        break;
      case 'avgRatingsAsc':
        handleSort(SORT.AVG_RATINGS, ORDER.ASC);
        break;
      case 'viewCountDesc':
        handleSort(SORT.VIEW_COUNT, ORDER.DESC);
        break;
      case 'viewCountAsc':
        handleSort(SORT.VIEW_COUNT, ORDER.ASC);
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
