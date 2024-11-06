import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useLocation } from 'react-router-dom';
import { FilterDropdownButton } from '../components/common/Button/FilterDropdownButton';
import { FilterListContainer } from '../components/display/RecipeListStyle';
import Layout from '../components/layout/Layout';
import { recipeAPI } from '../services/recipe.api';
import { ORDER, SORT } from '../utils/sort';
import RecipeCard from '../components/display/RecipeCard';
import { toast } from 'react-toastify';
import { useAuth } from '../context/Auth/AuthContext';
import {
  addFavoriteRecipeId,
  removeFavoriteRecipeId,
} from '../utils/sessionStorageUtil';
import { favoriteAPI } from '../services/favorite.api';
import CardListContainer from '../components/CardListContainer';
import { handleToggleFavorite } from '../utils/favoriteHandler';

const RecipePage = () => {
  const location = useLocation();
  const { state } = useAuth();
  const { more } = location.state || {};
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

  // @param recipe : 업데이트 대상 recipe 데이터
  // @param favoriteToUpdate : true > 즐겨찾기 추가 요청, false > 즐겨찾기 삭제 요청
  // const handleToggleFavorite = async (recipe, favoriteToUpdate) => {
  //   try {
  //     if (state.isAuthenticated) {
  //       if (favoriteToUpdate) {
  //         // 회원 > 즐겨찾기 추가 요청
  //         await favoriteAPI.addFavorite([recipe.id]);
  //         addFavoriteRecipeId(recipe.id); // 세션 스토리지에 추가
  //         toast.info('즐겨찾기에 성공적으로 추가되었습니다.');
  //       } else {
  //         // 회원 > 즐겨찾기 삭제 요청
  //         await favoriteAPI.removeFavorite(recipe.id);
  //         removeFavoriteRecipeId(recipe.id); // 세션 스토리지에서 제거
  //         toast.info('즐겨찾기에서 성공적으로 제거되었습니다.');
  //       }
  //     } else {
  //       if (favoriteToUpdate) {
  //         addFavoriteRecipeId(recipe.id); // 비회원 > 세션 스토리지에 추가
  //         toast.info('즐겨찾기에 추가되었습니다.');
  //       } else {
  //         removeFavoriteRecipeId(recipe.id); // 비회원 > 세션 스토리지에서 제거
  //         toast.info('즐겨찾기에서 제거되었습니다.');
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(
  //       '즐겨찾기 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.'
  //     );
  //   }
  // };

  // 더보기 전달값 적용
  useEffect(() => {
    if (more) {
      set;
      handleSort(more === 'viewCountDesc' ? SORT.VIEW_COUNT : more, ORDER.DESC);
    }
  }, [more]);

  return (
    <Layout isBackBtnExist pageName="레시피 전체 목록" isSearchBtnExist>
      <FilterListContainer>
        {/* 드롭다운 정렬버튼 */}
        <FilterDropdownButton handleSortChange={handleSortChange} />
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
