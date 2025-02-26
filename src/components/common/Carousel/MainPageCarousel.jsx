import CheckIcon from '@mui/icons-material/Check';
import React, { useState } from 'react';
import styled from 'styled-components';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatPrice } from '../../../utils/formatData';
import { StarRating } from '../../StarRating';
import { useAuth } from '../../../context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// 메인 캐러셀 (블러 X)
const Carousel = ({ recipes, year, week }) => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [updatedRecipes, setUpdatedRecipes] = useState(recipes);
  const [flippedRecipe, setFlippedRecipe] = useState(null); // 회전된 레시피 상태
  const [isFlipping, setIsFlipping] = useState(false);

  // 레시피 상세보기 클릭 이벤트
  const handleDetailClick = (recipe) => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleModifyUseRecipe = async (recipe) => {
    const recipeUsageRequest = {
      recipe: recipe,
      year: year,
      weekNumber: week,
    };

    try {
      if (!state?.isAuthenticated) {
        const storedData = sessionStorage.getItem('recommendedRecipeList');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // 해당 year와 week의 레시피를 찾기
          const recipeToUpdate = parsedData.recipes.find(
            (r) => r.id === recipe.id
          );
          if (recipeToUpdate) {
            // 사용 상태를 반대로 변경
            recipeToUpdate.used = recipeToUpdate.used === 1 ? 0 : 1;

            // 변경된 레시피를 다시 세션 스토리지에 저장
            sessionStorage.setItem(
              'recommendedRecipeList',
              JSON.stringify(parsedData)
            );

            setFlippedRecipe(null);
            setUpdatedRecipes((prevRecipes) =>
              prevRecipes.map((r) =>
                r.id === recipe.id ? { ...r, used: recipeToUpdate.used } : r
              )
            );
          }
        }
      } else {
        setFlippedRecipe(null);
        setUpdatedRecipes((prevRecipes) =>
          prevRecipes.map((r) =>
            r.id === recipe.id ? { ...r, used: !r.used } : r
          )
        );
      }
    } catch (error) {
      console.error('레시피 사용 상태 변경 실패:', error);
    }
  };

  const handleCardClick = (recipe) => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlippedRecipe(flippedRecipe === recipe.id ? null : recipe.id);

    setIsFlipping(false);
  };

  // 사용되지 않은 레시피와 사용된 레시피를 분리
  const unusedRecipes = updatedRecipes.filter((recipe) => recipe.used);
  const usedRecipes = updatedRecipes.filter((recipe) => !recipe.used);

  // 두 그룹을 결합
  const sortedRecipes = [...usedRecipes, ...unusedRecipes];

  return (
    <Swiper
      loop={recipes.length > 3}
      slidesPerView={recipes.length === 1 ? 1 : recipes.length === 2 ? 2 : 3}
      centeredSlides={true}
      spaceBetween={0}
      navigation={false}
      style={{ paddingBottom: '40px' }}
      pagination={recipes.length > 1 ? { clickable: false } : false}
      modules={[Navigation, Pagination]}
    >
      {sortedRecipes.map((recipe) => (
        <SwiperSlide key={recipe.id} style={{ width: '200px' }}>
          {({ isActive }) => (
            <FlipCard isFlipped={flippedRecipe === recipe.id}>
              <FrontCard
                onClick={isActive ? () => handleCardClick(recipe) : null}
              >
                <List>
                  <RecipeImageBox>
                    <RecipeImage
                      src={`${import.meta.env.VITE_BASE_SERVER_URL}${
                        recipe.thumbnailUrl
                      }`}
                      alt={recipe.title}
                    />
                    {recipe.used == 1 && (
                      <Overlay>
                        <CheckIcon
                          style={{ fontSize: '8rem', color: 'white' }}
                        />
                      </Overlay>
                    )}
                  </RecipeImageBox>
                  <TextBox>
                    <TitleText>{recipe.title}</TitleText>
                    <PriceText>
                      {formatPrice(recipe.price / recipe.servings)}원 (1인분)
                    </PriceText>
                    <StarText>
                      <StarRating ratings={recipe.avgRatings} /> (
                      {recipe.avgRatings})
                    </StarText>
                  </TextBox>
                </List>
              </FrontCard>

              <BackCard onClick={() => handleCardClick(recipe)}>
                <OptionButton onClick={() => handleModifyUseRecipe(recipe)}>
                  {recipe.used == 0 ? '먹었어요' : '안먹었어요'}
                </OptionButton>
                <OptionButton onClick={() => handleDetailClick(recipe)}>
                  상세정보
                </OptionButton>
              </BackCard>
            </FlipCard>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;

const FlipCard = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  cursor: pointer;
`;

const FrontCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  z-index: 2; // 앞면이 항상 위에 보이도록 설정
`;

const BackCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #dcdcdc;
  border-radius: 10px;
  z-index: 1; // 버튼이 앞에 오도록 설정
`;

const OptionButton = styled.button`
  width: 80%;
  margin: 8px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height: 300px; // 220px에서 줄임
  width: 200px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

const RecipeImageBox = styled.div`
  height: 200px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 102%;
  object-fit: cover;
  border-radius: 10px 10px 0px 0px;
`;

const TextBox = styled.div`
  width: 100%;
  text-align: center;
`;

const TitleText = styled.h4`
  font-family: 'GumiRomanceTTF'; // 낭만있구미체
  font-size: 24px;
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

const PriceText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 20px;
  margin: 3px 0;
`;

const StarText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 20px;
  margin: 3px 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5); // 투명도 조정
  z-index: 10; // 이미지 위에 표시
`;
