import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas, renderStars } from '../../utils/format';
import styled from 'styled-components';
import { forwardRef } from 'react';

const RecipeCard = forwardRef(({ recipe }, ref) => {
  const navigate = useNavigate();
  return (
    <CardContainer
      onClick={() => navigate(`/recipeDetail/${recipe.id}`)}
      ref={ref}
    >
      <ThumbnailImageBox>
        <Image
          src={`${import.meta.env.VITE_BASE_SERVER_URL}${recipe.thumbnailUrl}`}
          alt={recipe.title} // alt 속성 추가
        />
      </ThumbnailImageBox>
      <TextContainer>
        <TitleText>{recipe.title}</TitleText>
        <PriceText>{formatNumberWithCommas(recipe.price)}원 (1인분)</PriceText>
        <StarText>
          {renderStars(recipe.avgRatings)} {recipe.avgRatings}
        </StarText>
      </TextContainer>
    </CardContainer>
  );
});

export default RecipeCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
  margin: 5px;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); // 그림자 효과 변경
  cursor: pointer;
  transition: transform 0.2s; // 호버 시 애니메이션 효과
  &:hover {
    transform: scale(1.02); // 호버 시 확대 효과
  }
`;

// 레시피 이미지 영역
const ThumbnailImageBox = styled.div`
  height: 180px; // 고정 높이
  width: 180px; // 고정 너비
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; // 이미지 넘칠 경우 숨김
  border-radius: 10px;
`;

// 레시피 이미지
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; // 비율에 맞게 이미지 잘림
`;

// 텍스트 컨테이너
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 10px;
  width: calc(100% - 190px); // 이미지 크기를 제외한 너비 설정
  height: 100%;
`;

// 레시피 이름
const TitleText = styled.h3`
  font-size: 16px;
  margin: 0;
  text-align: left;
  white-space: nowrap; // 한줄 고정
  overflow: hidden; // 넘치면 숨김
  text-overflow: ellipsis; // 넘친 부분 ... 표시
  width: 100%;
`;

// 가격
const PriceText = styled.p`
  font-size: 12px;
  margin: 5px 0;
`;

// 평점
const StarText = styled.p`
  font-size: 12px;
  margin: 5px 0;
`;
