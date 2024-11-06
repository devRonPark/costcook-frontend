import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { StarRating } from '../StarRating';
import { formatPrice } from '../../utils/formatData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { PriceText, StarText, TitleText } from './RecipeListStyle';
import { Button } from '@mui/material';

export const BudgetRecipeSlide = ({ recipes }) => {
  const navigate = useNavigate();
  // 랜덤 출력 (데이터에 0 ~ 1 랜덤 부여 후 0.5와 비교)
  const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());

  return (
    <Swiper
      loop={true}
      slidesPerView={3}
      centeredSlides={true}
      spaceBetween={0}
      navigation={false}
      pagination={recipes.length > 1 ? { clickable: false } : false}
      modules={[Navigation, Pagination]}
      style={{ paddingBottom: '30px' }}
    >
      {shuffledRecipes.map((recipe) => (
        <SwiperSlideContainer key={recipe.id}>
          {({ isActive, isPrev, isNext }) => (
            <RecipeLink onClick={() => navigate(`/recipeDetail/${recipe.id}`)}>
              <CardContainer
                isActive={isActive}
                isNext={isNext}
                isPrev={isPrev}
              >
                <RecipeImageBox>
                  <RecipeImage
                    src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                    alt={recipe.title}
                  />
                </RecipeImageBox>
                <div>
                  <TitleText>{recipe.title}</TitleText>
                  <PriceText>
                    {formatPrice(recipe.price / recipe.servings)}원 (1인분)
                  </PriceText>
                  <StarText>
                    <StarRating ratings={recipe.avgRatings} /> (
                    {recipe.avgRatings})
                  </StarText>
                </div>
              </CardContainer>
            </RecipeLink>
          )}
        </SwiperSlideContainer>
      ))}
    </Swiper>
  );
};

const SwiperSlideContainer = styled(SwiperSlide)`
  text-align: center;
`;

const CardContainer = styled.div`
  width: 200px;
  height: 220px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  transition: transform 0.3s ease;
  transform: ${({ isActive, isPrev, isNext }) => {
    if (isActive) return 'scale(1.0)';
    if (isPrev || isNext) return 'scale(0.8)'; // 이전과 다음 카드 크기 줄임
    return 'scale(0.8)'; // 그 외에는 더 작게
  }};
`;
const RecipeLink = styled.button`
  margin-left: -20px;
  background-color: white;
  border: 0px solid white;
  border-radius: 10px;
`;

const RecipeImageBox = styled.div`
  height: 70%;
  overflow: hidden;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 102%;
  object-fit: cover;
`;
