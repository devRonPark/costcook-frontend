import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas, renderStars } from '../../utils/format';
import styled from 'styled-components';
import { forwardRef } from 'react';

const RecipeCard = forwardRef(({ recipe }, ref) => {
  const navigate = useNavigate();
  return (
    <CardContainer onClick={() => navigate(`/recipes/${recipe.id}`)} ref={ref}>
      <ThumbnailImageBox>
        <Image
          src={`${import.meta.VITE_BASE_SERVER_URL}${recipe.thumbnailUrl}`}
        />
      </ThumbnailImageBox>
      <div>
        <TitleText>{recipe.title}</TitleText>
        <PriceText>
          {formatNumberWithCommas(recipe.price)}원 (1인분 기준)
        </PriceText>
        <StarText>
          {renderStars(recipe.avgRatings)} {recipe.avgRatings}
        </StarText>
      </div>
    </CardContainer>
  );
});

export default RecipeCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 5px;
  margin: 5px;
  padding: 5px;
  height: 200px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

// 레시피 이미지 영역
const ThumbnailImageBox = styled.div`
  height: 180px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px 10px 0px 0px;
`;

// 레시피 이미지
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 레시피 이름
const TitleText = styled.h3`
  font-size: 16px;
  margin: 3px 0;
  text-align: center;
  white-space: nowrap; // 한줄 고정
  overflow: hidden; // 넘치면 숨김
  text-overflow: ellipsis; // 넘친 부분 ... 표시
  width: 100%;
`;

// 가격
const PriceText = styled.p`
  font-size: 12px;
  margin: 3px 0;
`;

// 평점
const StarText = styled.p`
  font-size: 12px;
  margin: 3px 0;
`;
