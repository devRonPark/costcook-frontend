import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import styled from 'styled-components';
import { StarRating } from '../../../StarRating';
import { formatPrice } from '../../../../utils/formatData';
import './carousel.css';
import CheckIcon from '@mui/icons-material/Check';
import { recommendAPI } from '../../../../services/recommend.api';

const Carousel = ({ recipes, year, week }) => {
  const [updatedRecipes, setUpdatedRecipes] = useState(recipes);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleModifyUseRecipe = async (recipe) => {
    const recipeUsageRequest = {
      recipe: recipe,
      year: year,
      weekNumber: week,
    };

    try {
      const response = await recommendAPI.modifyUseRecipe(recipeUsageRequest);

      setUpdatedRecipes((prevRecipes) =>
        prevRecipes.map((r) =>
          r.id === recipe.id ? { ...r, used: !r.used } : r
        )
      );
      console.log('레시피 사용 상태 변경 성공:', response.data);
    } catch (error) {
      console.error('레시피 사용 상태 변경 실패:', error);
    }
  };

  // 사용되지 않은 레시피와 사용된 레시피를 분리

  const unusedRecipes = updatedRecipes.filter((recipe) => recipe.used);
  const usedRecipes = updatedRecipes.filter((recipe) => !recipe.used);

  // 두 그룹을 결합
  const sortedRecipes = [...usedRecipes, ...unusedRecipes];

  return (
    <Swiper
      loop
      slidesPerView={recipes.length === 1 ? 1 : recipes.length === 2 ? 2 : 3}
      centeredSlides={true}
      spaceBetween={0}
      navigation={false}
      pagination={recipes.length > 1 ? { clickable: true } : false}
      modules={[Navigation, Pagination]}
      style={{ paddingBottom: '30px' }}
    >
      {sortedRecipes.map((recipe, index) => (
        <SwiperSlide key={recipe.id} style={{ width: '210px' }}>
          {({ isActive }) => (
            <List
              onClick={
                isActive ? () => handleModifyUseRecipe(recipe) : undefined
              }
            >
              <RecipeImageBox>
                <RecipeImage
                  src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                  alt={recipe.title}
                />
                {recipe.used && (
                  <Overlay>
                    <CheckIcon style={{ fontSize: '8rem', color: 'white' }} />
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
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin: 5px;
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
  width: 123%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5); // 투명도 조정
  z-index: 10; // 이미지 위에 표시
`;
