import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StarRating } from '../StarRating';
import { formatPrice } from '../../utils/formatData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export const RecipeSlide = ({ recipes }) => {
  return (
    <SlideContainer style={{ display: 'flex' }}>
      {recipes.map((recipe) => (
        <div key={recipe.id} style={{ width: '200px', marginRight: '10px' }}>
          <RecipeCard>
            <Link to={`/recipeDetail/${recipe.id}`}>
              <ImageContainer>
                <RecipeImage
                  alt={recipe.title}
                  src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                />
              </ImageContainer>
            </Link>
            <RecipeTitle>{recipe.title}</RecipeTitle>
            <RecipePrice>
              {formatPrice(recipe.price / recipe.servings)}원 (1인분)
            </RecipePrice>
            <StarText>
              <StarRating ratings={recipe.avgRatings} /> ({recipe.avgRatings})
            </StarText>
          </RecipeCard>
        </div>
      ))}
    </SlideContainer>
  );
};

// 스타일 컴포넌트
const SlideContainer = styled.div`
  display: flex;
  overflow-x: auto;
  height: 200px;
  align-items: flex-start;
`;

const RecipeCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  text-align: center;
`;

const ImageContainer = styled.div`
  /* position: relative; */
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const RecipeImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const RecipeTitle = styled.div`
  font-family: 'GumiRomanceTTF';
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
`;

const RecipePrice = styled.div`
  font-family: 'BMJUA';
  font-size: 1rem;
  color: #666;
  margin: 5px 0;
`;

const StarText = styled.div`
  font-family: 'BMJUA';
  font-size: 1rem;
  color: #ffb400;
  margin: 5px 0;
`;
