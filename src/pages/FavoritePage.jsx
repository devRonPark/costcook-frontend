import styled from 'styled-components';
import { Button, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import RoundedButton from '../components/common/Button/RoundedButton';
import { useAuth } from '../context/Auth/AuthContext';
import RecipeCard from '../components/display/RecipeCard';

// 즐겨찾기 페이지
const FavoritePage = () => {
  // state.isAuthenticated : 회원 로그인 여부 판단
  // state.isAuthenticated 가 false > 비회원은 sessionStorage.getItem("favoriteRecipeIds"): [1, 2, 3] > 레시피 카드로 보여줄 레시피 정보 리스트 형태로 출력.
  // state.isAuthenticated 가 true > 회원은 즐겨찾기 목록 조회 요청(페이징)
  const { state } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isDeleteStatus, setIsDeleteStatus] = useState(false);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  // 가정: 즐겨찾기 목록 조회 요청 함수
  const fetchFavoriteRecipes = async () => {
    const response = {
      page: 1,
      size: 1,
      totalPages: 1,
      totalFavorites: 1,
      favorites: [
        {
          id: {
            userId: 21,
            recipeId: 3,
          },
          recipe: {
            id: 3,
            title: '단호박찹쌀도넛',
            price: 4381,
            avgRatings: 4.4,
            thumbnailUrl: '/img/recipe/763499.jpg',
          },
        },
        // 추가적인 레시피 예시
        {
          id: {
            userId: 21,
            recipeId: 4,
          },
          recipe: {
            id: 4,
            title: '김치볶음밥',
            price: 4300,
            avgRatings: 4.0,
            thumbnailUrl: '/img/recipe/763500.jpg',
          },
        },
      ],
    };

    setFavorites(response.favorites);

    // 실제 API 호출 부분
    // const response = await fetch('/api/favorites');
    // const data = await response.json();

    setFavorites(response.favorites);
  };

  const toggleDeleteStatus = () => {
    setIsDeleteStatus((prev) => !prev); // 삭제 상태 토글
    if (!isDeleteStatus) {
      setSelectedRecipeIds([]); // 삭제 모드가 활성화될 때 선택된 ID 초기화
    }
  };

  const handleCheckboxChange = (recipeId) => {
    setSelectedRecipeIds((prevIds) => {
      if (prevIds.includes(recipeId)) {
        // 이미 선택된 경우 -> 선택 해제
        return prevIds.filter((id) => id !== recipeId);
      } else {
        // 선택되지 않은 경우 -> 선택 추가
        return [...prevIds, recipeId];
      }
    });
  };

  const handleDeleteSelected = () => {
    // 선택된 레시피 삭제 처리 (여기서는 상태에서 삭제)
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (favorite) => !selectedRecipeIds.includes(favorite.id.recipeId)
      )
    );
    setSelectedRecipeIds([]); // 삭제 후 선택 초기화
  };

  // 컴포넌트 마운트 시 즐겨찾기 데이터 로드
  useEffect(() => {
    if (state.isAuthenticated) {
      fetchFavoriteRecipes();
    }
  }, [state.isAuthenticated]);

  return (
    <Layout
      isBackBtnExist
      pageName="저장된 레시피"
      isFavoritePage
      onDeleteClick={toggleDeleteStatus}
    >
      <DataContainer>
        {favorites.map((favorite) => (
          <DataBoxContainer key={favorite.id.recipeId}>
            {isDeleteStatus && (
              <CheckBox
                type="checkbox"
                checked={selectedRecipeIds.includes(favorite.id.recipeId)}
                onChange={() => handleCheckboxChange(favorite.id.recipeId)}
              />
            )}
            <RecipeCard
              recipe={favorite.recipe}
              onToggleFavorite={null} // 필요 없으므로 null 전달
              showFavoriteIcon={false} // 즐겨찾기 아이콘 숨김
            />
          </DataBoxContainer>
        ))}
      </DataContainer>
      {isDeleteStatus && (
        <RoundedButton
          text="삭제하기"
          backgroundColor={selectedRecipeIds.length > 0 ? 'red' : '#ccc'} // 버튼 색상 변경
          disabled={selectedRecipeIds.length === 0} // 비활성화 조건 추가
          onClick={selectedRecipeIds.length > 0 ? handleDeleteSelected : null} // 클릭 핸들러 설정
          style={{
            cursor: selectedRecipeIds.length > 0 ? 'pointer' : 'not-allowed', // 커서 스타일 변경
            opacity: selectedRecipeIds.length > 0 ? 1 : 0.5, // 비활성화 시 투명도 조정
          }}
        />
      )}
    </Layout>
  );
};

export default FavoritePage;

// 구현할때 고려사항

// 한개라도 Data가 있으면 Height를 690으로 고정시키기
const DataContainer = styled.div`
  margin: 20px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;
`;

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
