import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/pagination';
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
      // loop
      slidesPerView={5}
      centeredSlides={true}
      centeredSlidesBounds={true}
      spaceBetween={0}
      pagination={{ clickable: false }}
      modules={[Pagination]}
      className="mySwiper"
      style={{ margin: 'auto 0' }}
    >
      {recipes.map((recipe) => (
        <SwiperSlide key={recipe.id}>
          {({ isActive, isPrev, isNext }) => (
            // <RecipeLink >
            <CardContainer
              isActive={isActive}
              isNext={isNext}
              isPrev={isPrev}
              onClick={() => navigate(`/recipeDetail/${recipe.id}`)}
            >
              <RecipeImage
                src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
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
            // </RecipeLink>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const RecipeInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const CardContainer = styled.div`
  width: 100px; /* 카드 너비 고정 */
  height: 15rem; /* 카드 높이 고정 */
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  transition: transform 0.3s ease;
  transform: ${({ isActive, isPrev, isNext }) => {
    if (isActive) return 'scale(1.0)';
    if (isPrev || isNext) return 'scale(0.9)'; // 이전과 다음 카드 크기 줄임
    return 'scale(0.8)'; // 그 외에는 더 작게
  }};
`;
// const RecipeLink = styled.button`
//   background-color: white;
//   border: 0px solid white;
//   border-radius: 10px;
// `;

// const RecipeImageBox = styled.div`
//   height: 70%;
//   overflow: hidden;
// `;

const RecipeImage = styled.img`
  width: 100%; /* 이미지 너비 고정 */
  height: 158px; /* 이미지 높이 고정 */
  object-fit: cover; /* 이미지 비율 유지 */
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;
