import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas, renderStars } from '../../utils/format';
import styled from 'styled-components';
import { forwardRef, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { StarRating } from '../StarRating';

const RecipeCard = forwardRef(
  (
    {
      recipe,
      onToggleFavorite,
      isAuthenticated,
      showFavoriteIcon = true,
      layoutType,
    },
    ref
  ) => {
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(recipe.favorite);

    const handleFavoriteClick = (e) => {
      e.stopPropagation(); // 카드 클릭과 즐겨찾기 클릭이 동시에 실행되지 않도록 막기
      setFavorite(!favorite);
      onToggleFavorite(recipe, !favorite, isAuthenticated);
    };

    return (
      <CardContainer
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        ref={ref}
        layoutType={layoutType}
      >
        {showFavoriteIcon && (
          <FavoriteButton onClick={handleFavoriteClick}>
            {favorite ? (
              <FavoriteIcon style={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon style={{ color: 'gray' }} />
            )}
          </FavoriteButton>
        )}
        <ThumbnailImageBox>
          <Image
            src={`${import.meta.env.VITE_BASE_SERVER_URL}${
              recipe.thumbnailUrl
            }`}
            alt={recipe.title} // alt 속성 추가
          />
        </ThumbnailImageBox>
        <TextContainer>
          <TitleText>{recipe.title}</TitleText>
          <PriceText>
            {formatNumberWithCommas(recipe.price)}원 (1인분)
          </PriceText>
          <StarText>
            <StarRating ratings={recipe.avgRatings} /> ({recipe.avgRatings})
          </StarText>
        </TextContainer>
      </CardContainer>
    );
  }
);

export default RecipeCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: calc(100% - 10px);
  min-width: 200px; // 카드의 최소 너비 설정 (가로로 두 개가 들어갈 수 있는 최소 크기)
  padding: 10px;
  border-radius: 10px; // 카드 모서리 둥글게
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); // 그림자 효과
  cursor: pointer; // 포인터 커서
  position: relative;

  /* 500px 이하에서 두 개씩 배치될 때 크기 조절 */
  ${({ layoutType }) =>
    layoutType === 'recipe' &&
    `
      @media (max-width: 500px) {
        min-width: 200px;
        flex-direction: row;
        width: calc(100vw - 10px);
      }

      @media (min-width: 501px) {
        width: calc(50% - 5px);
        flex-direction: column;
        align-items: flex-start;
      }
    `}

  /* 메인 페이지에서 한 줄에 세 개 배치 */
  ${({ layoutType }) =>
    layoutType === 'main' &&
    `
      width: calc(33.33% - 10px);
    `}

  ${({ layoutType }) =>
    layoutType === 'search' &&
    `
      @media (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
      }
    `}
  ${({ layoutType }) =>
    layoutType === 'favorite' &&
    `
      @media (max-width: 440px) {
        flex-direction: column;
      }
    `}
`;

const FavoriteButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1;
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
  height: 100%;
  flex: 1;

  @media (min-width: 500px) {
    margin-left: 0;
    margin-top: 10px;
  }
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
  font-family: 'Mungyeong-Gamhong-Apple';
  font-weight: 100;
`;

// 가격
const PriceText = styled.p`
  font-size: 13px;
  margin: 5px 0;
  font-family: 'GangwonEdu_OTFBoldA';
`;

// 평점
const StarText = styled.p`
  font-size: 14px;
  margin: 5px 0;
  font-family: 'RixXladywatermelonR';
`;
