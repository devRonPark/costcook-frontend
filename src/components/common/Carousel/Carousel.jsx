import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './carousel.css';
import CarouselCard from './CarouselCard';
import { recipeAPI } from '../../../services/recipe.api';

const Carousel = ({ budget, selectedRecipes, onSelect, remainingBudget }) => {
  const [recipes, setRecipes] = useState([]);

  const minBudget = budget * 0.2;
  const maxBudget = budget * 0.4;
  // const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipesByBudget = async () => {
      try {
        const response = await recipeAPI.getRecipesByBudget(
          minBudget,
          maxBudget
        );
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes by budget:', error);
      }
    };

    fetchRecipesByBudget();
  }, [minBudget, maxBudget]); // budget 변경 시마다 실행

  return (
    <Swiper
      loop
      slidesPerView={5}
      centeredSlides={true}
      spaceBetween={100}
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
    >
      {recipes.map(
        (
          data // 가져온 레시피 데이터로 슬라이드 구성
        ) => (
          <SwiperSlide key={data.id}>
            {({ isActive, isPrev, isNext }) => (
              <CarouselCard
                isActive={isActive}
                isPrev={isPrev}
                isNext={isNext}
                data={data}
                selectedRecipes={selectedRecipes}
                onSelect={onSelect}
                remainingBudget={remainingBudget}
              />
            )}
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
};

export default Carousel;
