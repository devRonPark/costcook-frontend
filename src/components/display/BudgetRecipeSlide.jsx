import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StarRating } from '../StarRating';
import { formatPrice } from '../../utils/formatData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { PriceText, StarText, TitleText } from './RecipeListStyle';

export const BudgetRecipeSlide = ({ recipes }) => {
  // 랜덤 출력 (데이터에 0 ~ 1 랜덤 부여 후 0.5와 비교)
  const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());

  return (
    <Swiper
      loop={recipes.length > 1}
      // slidesPerView={recipes.length === 1 ? 1 : recipes.length === 2 ? 2 : 3}
      slidesPerView={3}
      centeredSlides={true}
      spaceBetween={-40}
      navigation={false}
      pagination={recipes.length > 1 ? { clickable: true } : false}
      modules={[Navigation, Pagination]}
      style={{ paddingBottom: '30px' }}
    >
      {shuffledRecipes.map((recipe) => (
        <SwiperSlide key={recipe.id} style={{ margin: '-1px' }}>
          <Link to={`/recipeDetail/${recipe.id}`}>
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
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height: 220px;
  width: 200px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

const RecipeImageBox = styled.div`
  height: 100%;
  width: 100%;
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
