import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import { FilterDropdownButton } from '../components/common/Button/FilterDropdownButton';
import { FilterListContainer } from '../components/display/RecipeListStyle';
import Layout from '../components/layout/Layout';
import { recipeAPI } from '../services/recipe.api';
import { ORDER, SORT } from '../utils/sort';
import RecipeCard from '../components/display/RecipeCard';
import { useAuth } from '../context/Auth/AuthContext';
import CardListContainer from '../components/CardListContainer';
import { handleToggleFavorite } from '../utils/favoriteHandler';

const options = [
  {
    name: '등록일 순',
    value: 'createdAt',
    sort: SORT.CREATED_AT,
    order: ORDER.DESC,
  },
  {
    name: '평점 높은 순',
    value: 'avgRatingsDesc',
    sort: SORT.AVG_RATINGS,
    order: ORDER.DESC,
  },
  {
    name: '평점 낮은 순',
    value: 'avgRatingsAsc',
    sort: SORT.AVG_RATINGS,
    order: ORDER.ASC,
  },
  {
    name: '조회수 높은 순',
    value: 'viewCountDesc',
    sort: SORT.VIEW_COUNT,
    order: ORDER.DESC,
  },
  {
    name: '조회수 낮은 순',
    value: 'viewCountAsc',
    sort: SORT.VIEW_COUNT,
    order: ORDER.ASC,
  },
];

const RecipePage = () => {
  const location = useLocation();
  const { state } = useAuth();
  const { more } = location.state || {};
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [page, setPage] = useState(1); // 현재 페이지
  const { ref, inView } = useInView(); // 로딩 감지용 useRef
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 확인
  const [selectedOption, setSelectedOption] = useState('createdAt'); // 드롭다운 기본 선택 상태

  // 페이지 로드시 'more' 값이 있는 경우 selectedOption 업데이트하고 정렬 기준에 맞춰 데이터 조회
  useEffect(() => {
    if (more === 'viewCountDesc') {
      setSelectedOption('viewCountDesc');
    } else {
      fetchData(SORT.CREATED_AT, ORDER.DESC, 1); // 기본값인 등록일 순으로 데이터 로드
    }
  }, [more]);

  // 선택된 정렬 기준이나 페이지가 변경될 때 데이터 로드
  useEffect(() => {
    const foundedOption = options.find(
      (option) => option.value === selectedOption
    );
    if (foundedOption) {
      fetchData(foundedOption.sort, foundedOption.order, page);
    }
  }, [selectedOption, page]);

  // 데이터 가져오는 메소드
  const fetchData = async (sort, order, page) => {
    try {
      const res = await recipeAPI.getRecipeList(page, sort, order);
      if (res.data.recipes.length === 0) {
        setHasMore(false);
        return;
      }
      if (page === 1) {
        setRecipeList(res.data.recipes);
      } else {
        setRecipeList((prevRecipes) => {
          const newRecipes = res.data.recipes.filter(
            (newRecipe) => !prevRecipes.some((prev) => prev.id === newRecipe.id)
          );
          return [...prevRecipes, ...newRecipes];
        });
      }
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };

  // 드롭다운 정렬 변경 핸들러
  const handleSortChange = (e) => {
    setSelectedOption(e.target.value);
    setPage(1); // 정렬 기준 변경 시 페이지 초기화
    setRecipeList([]);
  };

  // 스크롤시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  return (
    <Layout isBackBtnExist pageName="레시피 전체 목록" isSearchBtnExist>
      <FilterListContainer>
        {/* 드롭다운 정렬버튼 */}
        <FilterDropdownButton
          value={selectedOption}
          options={options}
          handleSortChange={handleSortChange}
        />
      </FilterListContainer>

      {/* 레시피 목록  Container */}
      <CardListContainer layoutType="recipe">
        {recipeList.map((recipe, index) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={{ ...recipe }}
              onToggleFavorite={handleToggleFavorite}
              isAuthenticated={state?.isAuthenticated ?? false}
              layoutType="recipe"
            />
          );
        })}
        {/* 데이터가 더 있으면 추가 로드 */}
        {hasMore && <p ref={ref}></p>}
      </CardListContainer>
    </Layout>
  );
};

export default RecipePage;
