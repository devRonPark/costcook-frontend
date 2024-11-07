import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import 'swiper/css';
// import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatPrice } from '../../utils/formatData';
import { StarRating } from '../StarRating';
import { PriceText, StarText, TitleText } from './RecipeListStyle';

export const BudgetRecipeSlide = ({ recipes }) => {
  const navigate = useNavigate();
  // 랜덤 출력 (데이터에 0 ~ 1 랜덤 부여 후 0.5와 비교)
  const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());

  return (
    <Swiper
      loop={false}
      slidesPerView={recipes.length === 1 ? 1 : recipes.length === 2 ? 2 : 3}
      centeredSlides={true}
      centeredSlidesBounds={true}
      spaceBetween={-50}
    >
      {shuffledRecipes.map((recipe) => (
        <SwiperSlideContainer key={recipe.id}>
          {({ isActive, isPrev, isNext }) => (
            <CardContainer
              recipesLength={recipes.length}
              isActive={isActive}
              isNext={isNext}
              isPrev={isPrev}
              onClick={() => navigate(`/recipeDetail/${recipe.id}`)}
            >
              <RecipeImage
                src={`${import.meta.env.VITE_BASE_SERVER_URL}${
                  recipe.thumbnailUrl
                }`}
                alt={recipe.title}
              />
              <RecipeInfoContainer>
                <TitleText>{recipe.title}</TitleText>
                <PriceText>
                  {formatPrice(recipe.price / recipe.servings)}원 (1인분)
                </PriceText>
                <StarText>
                  <StarRating ratings={recipe.avgRatings} /> (
                  {recipe.avgRatings})
                </StarText>
              </RecipeInfoContainer>
            </CardContainer>
          )}
        </SwiperSlideContainer>
      ))}
    </Swiper>
  );
};

const SwiperSlideContainer = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
`;

const RecipeInfoContainer = styled.div`
  text-align: center;
  overflow: hidden;
`;

const CardContainer = styled.div`
  width: 200px;
  height: 220px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  transition: transform 0.3s ease;
  /* recipes.length가 3 미만일 경우 transform을 안 하도록 */
  transform: ${({ recipesLength, isActive, isPrev, isNext }) => {
    if (recipesLength < 3) return 'scale(1.0)'; // 레시피가 3개 미만일 경우 transform 안 적용
    if (isActive) return 'scale(1.0)';
    if (isPrev || isNext) return 'scale(0.9)';
    return 'scale(0.8)';
  }};
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
`;
