import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트
import styled from 'styled-components';

const RecipeSlide = ({ recipes }) => {
  return (
    <StyledSwiper
      loop
      slidesPerView={3} // 슬라이드에서 보여줄 카드 수 조정
      centeredSlides={true}
      spaceBetween={30} // 카드 간의 간격
      navigation={true}
      modules={[Navigation]}
      className="recipeSwiper"
    >
      {recipes.map((recipe) => (
        <SwiperSlide key={recipe.id}>
          <Link to={`/recipeDetail/${recipe.id}`}>
            <Card>
              <Image
                src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
                alt={recipe.title}
              />
              <Title>{recipe.title}</Title>
              <Price>
                {formatPrice(recipe.price / recipe.servings)}원 (1인분)
              </Price>
            </Card>
          </Link>
        </SwiperSlide>
      ))}
    </StyledSwiper>
  );
};

// Styled Component for Swiper
const StyledSwiper = styled(Swiper)`
  padding: 20px; /* 전체 Swiper에 패딩 추가 */
`;

const Card = styled.div`
  background-color: #ffffff; /* 카드 배경 색상 */
  border-radius: 8px; /* 카드 모서리 둥글게 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s; /* 카드 확대 효과 */
  text-align: center; /* 텍스트 중앙 정렬 */
  cursor: pointer; /* 포인터 커서로 변경 */

  &:hover {
    transform: translateY(-5px); /* 호버 시 카드 상승 효과 */
  }
`;

const Image = styled.img`
  width: 100%; /* 카드 너비에 맞게 이미지 너비 조정 */
  height: auto; /* 이미지 비율 유지 */
  border-top-left-radius: 8px; /* 상단 왼쪽 모서리 둥글게 */
  border-top-right-radius: 8px; /* 상단 오른쪽 모서리 둥글게 */
`;

const Title = styled.div`
  font-size: 1.2rem; /* 제목 폰트 크기 */
  font-weight: bold; /* 제목 두께 */
  margin: 10px 0; /* 제목 간격 */
`;

const Price = styled.div`
  color: #888; /* 가격 색상 */
  margin: 5px 0; /* 가격 간격 */
`;

// formatPrice 함수는 별도로 정의되어 있어야 합니다.
const formatPrice = (price) => {
  return price.toLocaleString(); // 한국식 숫자 포맷으로 변환
};

export default RecipeSlide;
