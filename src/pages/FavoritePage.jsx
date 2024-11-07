import styled from 'styled-components';
import { Button, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import RoundedButton from '../components/common/Button/RoundedButton';
import { useAuth } from '../context/Auth/AuthContext';
import RecipeCard from '../components/display/RecipeCard';
import { recipeAPI } from '../services/recipe.api';
import {
  getFavoriteRecipeIds,
  removeFavoriteRecipeIds,
} from '../utils/sessionStorageUtil';
import LoadingComponent from '../components/common/LoadingComponent';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/display/ImageDisplay';
import { favoriteAPI } from '../services/favorite.api';
import { useInView } from 'react-intersection-observer';
import CardListContainer from '../components/CardListContainer';

// 즐겨찾기 페이지
const FavoritePage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDeleteStatus, setIsDeleteStatus] = useState(false);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const { ref: lastRecipeElementRef, inView } = useInView();

  // 로그인/비로그인에 따라 레시피 데이터를 로드하는 함수
  useEffect(() => {
    const loadFavorites = async (newPage) => {
      setLoading(true);
      try {
        if (state.isAuthenticated) {
          await fetchFavoriteRecipes(newPage);
        } else {
          const recipeIds = getFavoriteRecipeIds();
          if (recipeIds.length > 0) {
            const res = await recipeAPI.getRecipeListByIds(recipeIds);
            setFavorites(transformGuestFavorites(res.data));
          } else {
            setFavorites([]);
          }
        }
      } catch (err) {
        toast.error('즐겨찾기 레시피를 불러오는 데 실패했습니다.');
        console.error('Failed to fetch favorite recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites(page);
  }, [state.isAuthenticated, page]);

  useEffect(() => {
    if (state.isAuthenticated && inView && !loading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, page, totalPages, state.isAuthenticated]);

  // 비로그인 상태에서 가져온 데이터 구조를 일관되게 변환하는 함수
  const transformGuestFavorites = (recipes) => {
    return recipes.map((recipe) => ({
      id: { recipeId: recipe.id },
      recipe: {
        id: recipe.id,
        title: recipe.title,
        price: recipe.price,
        avgRatings: recipe.avgRatings,
        thumbnailUrl: recipe.thumbnailUrl,
      },
    }));
  };

  const fetchFavoriteRecipes = async (newPage = 1) => {
    try {
      const res = await favoriteAPI.getFavorites(newPage);
      if (res.status === 200) {
        const { favorites, totalPages } = res.data;
        if (newPage === 1) {
          setFavorites(favorites);
          setPage(1);
        } else {
          setFavorites((prev) => [...prev, ...favorites]);
        }
        setTotalPages(totalPages);
      }
    } catch (error) {
      toast.error('즐겨찾기 레시피를 불러오는 데 실패했습니다.');
      console.error('Failed to fetch favorite recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDeleteStatus = () => {
    setIsDeleteStatus((prev) => !prev);
    if (!isDeleteStatus) {
      setSelectedRecipeIds([]);
    }
  };

  const handleCheckboxChange = (recipeId) => {
    setSelectedRecipeIds((prevIds) => {
      if (prevIds.includes(recipeId)) {
        return prevIds.filter((id) => id !== recipeId);
      } else {
        return [...prevIds, recipeId];
      }
    });
  };

  // 삭제하기 버튼 클릭 핸들러
  const handleDeleteSelected = () => {
    if (state.isAuthenticated) {
      handleDeleteAuthenticated();
    } else {
      handleDeleteUnauthenticated();
    }
  };

  // 로그인 상태에서 즐겨찾기 삭제 처리
  const handleDeleteAuthenticated = async () => {
    try {
      const res = await favoriteAPI.removeFavorites(selectedRecipeIds);
      if (res.status === 200) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => !selectedRecipeIds.includes(favorite.id.recipeId)
          )
        );
        setSelectedRecipeIds([]);
        setIsDeleteStatus(false);
        toast.success('선택한 레시피가 즐겨찾기에서 삭제되었습니다.');
      } else {
        toast.error('즐겨찾기 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('즐겨찾기 삭제 중 오류 발생:', error);
      toast.error('즐겨찾기 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 비로그인 상태에서 즐겨찾기 삭제 처리
  const handleDeleteUnauthenticated = () => {
    removeFavoriteRecipeIds(selectedRecipeIds);
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (favorite) => !selectedRecipeIds.includes(favorite.id.recipeId)
      )
    );
    setSelectedRecipeIds([]);
    setIsDeleteStatus(false);
    toast.success('선택한 레시피가 즐겨찾기에서 삭제되었습니다.');
  };

  return (
    <Layout
      isBackBtnExist
      pageName="즐겨찾기"
      isFavoritePage
      onDeleteClick={toggleDeleteStatus}
    >
      {loading && (
        <LoadingComponent
          loading={loading}
          loadingText={'즐겨찾기에 추가된 레시피 불러오는 중...'}
        />
      )}
      <CardListContainer layoutType="favorite">
        {favorites.length === 0 ? (
          <NoFavoritesContainer>
            <ImageDisplay
              src={`${import.meta.env.VITE_PUBLIC_URL}/cookbook.png`}
              altText="즐겨찾기에 저장된 레시피"
              width="100px"
              height="100px"
              borderRadius="0"
              border="none"
              backgroundColor="none"
              margin="30px auto"
            />
            <NoFavoritesText>저장된 레시피가 없습니다.</NoFavoritesText>
            <BrowseButton onClick={() => navigate('/recipes')}>
              레시피 구경가기
            </BrowseButton>
          </NoFavoritesContainer>
        ) : (
          favorites.map((favorite, index) => (
            <DataBoxContainer key={favorite.id.recipeId}>
              {isDeleteStatus && (
                <CheckBox
                  type="checkbox"
                  checked={selectedRecipeIds.includes(favorite.id.recipeId)}
                  onChange={() => handleCheckboxChange(favorite.id.recipeId)}
                />
              )}
              <RecipeCard
                layoutType="favorite"
                recipe={favorite.recipe}
                onToggleFavorite={null}
                showFavoriteIcon={false}
                ref={
                  index === favorites.length - 1 ? lastRecipeElementRef : null
                }
              />
            </DataBoxContainer>
          ))
        )}
      </CardListContainer>
      {isDeleteStatus && (
        <RoundedButton
          text="삭제하기"
          width="calc(100% - 10px)"
          hoverBackgroundColor="none"
          backgroundColor={selectedRecipeIds.length > 0 ? 'red' : '#ccc'}
          disabled={selectedRecipeIds.length === 0}
          onClick={selectedRecipeIds.length > 0 ? handleDeleteSelected : null}
          style={{
            cursor: selectedRecipeIds.length > 0 ? 'pointer' : 'not-allowed',
            opacity: selectedRecipeIds.length > 0 ? 1 : 0.5,
            position: selectedRecipeIds.length > 0 ? 'absolute' : 'static',
            bottom: selectedRecipeIds.length > 0 ? '10px' : 0,
          }}
        />
      )}
    </Layout>
  );
};

export default FavoritePage;

const DataBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CheckBox = styled(Checkbox)`
  width: 50px;
`;

const NoFavoritesContainer = styled.div`
  width: 100%;
  text-align: center;
  margin: 20px 0;

  * + * {
    margin-top: 30px;
  }
`;

const NoFavoritesText = styled.p`
  font-size: 16px;
  color: #555;
`;

const BrowseButton = styled.button`
  width: 80%;
  border: 2px solid #ffdb58;
  color: #ffdb58;
  cursor: pointer;
  border-radius: 25px;
  background-color: transparent;
  padding: 10px; // 패딩 추가
  font-size: 16px; // 글자 크기 설정
  transition: background-color 0.3s; // 배경색 전환 효과
  outline: none;

  &:hover {
    background-color: #ffd700; // hover 시 진한 노란색
    color: white;
  }
`;
