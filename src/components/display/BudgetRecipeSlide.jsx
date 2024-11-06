import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { StarRating } from '../StarRating';
import { formatPrice } from '../../utils/formatData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { PriceText, StarText, TitleText } from './RecipeListStyle';

export const BudgetRecipeSlide = ({ recipes }) => {
  const navigate = useNavigate();
  // 랜덤 출력 (데이터에 0 ~ 1 랜덤 부여 후 0.5와 비교)
  const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());

  return (
    <Swiper
      loop={recipes.length > 1}
      slidesPerView={recipes.length === 1 ? 1 : recipes.length === 2 ? 2 : 3}
      centeredSlides={true}
      spaceBetween={-40}
      navigation={false}
      pagination={recipes.length > 1 ? { clickable: false } : false}
      modules={[Navigation, Pagination]}
      style={{ paddingBottom: '30px', marginLeft: '-30px' }}
    >
      {shuffledRecipes.map((recipe) => (
        <SwiperSlideContainer key={recipe.id} style={{ margin: '-1px' }}>
          <RecipeLink onClick={() => navigate(`/recipeDetail/${recipe.id}`)}>
            <List>
              <RecipeImageBox>
                <RecipeImage
                  src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                  alt={recipe.title}
                />
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
          </RecipeLink>
        </SwiperSlideContainer>
      ))}
    </Swiper>
  );
};

const SwiperSlideContainer = styled(SwiperSlide)`
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
`;

const RecipeLink = styled.button`
  border: 0px solid white;
  border-radius: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height: 200px;
  width: 200px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

const RecipeImageBox = styled.div`
  width: 100%;
  height: 70%;
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
