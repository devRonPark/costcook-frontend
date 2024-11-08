import styled from 'styled-components';
import CarouselData from './CarouselData';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';

const CarouselCard = ({
  isActive,
  isPrev,
  isNext,
  data,
  selectedRecipes,
  onSelect,
  remainingBudget,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const isUsed = selectedRecipes.some(
    (recipe) => recipe.id === data.id && recipe.used == 1
  );

  useEffect(() => {
    setIsClicked(selectedRecipes.some((recipe) => recipe.id === data.id));
  }, [selectedRecipes, data.id]);

  // // 카드 클릭 시 상태 변경 함수
  const handleCardClick = () => {
    // 이미 선택된 레시피를 취소하는 경우
    if (isClicked) {
      // 선택 취소 시 예산 초과 체크는 필요 없음
      onSelect(data);
      return;
    }

    // 예산이 충분한 경우에만 선택하도록 처리
    if (remainingBudget >= data.price / data.servings) {
      if (isActive) onSelect(data);
    } else if (!isUsed) {
      // 예산 초과 시, 사용되지 않은 레시피에 대해서만 처리
      toast.error(`예산을 초과했습니다.`);
    } else {
      // 이미 사용된 레시피는 취소 불가
      toast.error(`이미 사용한 레시피입니다.`);
    }
  };

  // isActive, isPrev, isNext 상태에 따라 CSS scale 값을 반환
  const getScale = () => {
    if (isActive) return 'scale(1)';
    if (isPrev || isNext) return 'scale(0.9)';
    return 'scale(0.8)';
  };

  return (
    <CardContainer
      scale={getScale()}
      onClick={isActive && !isUsed ? handleCardClick : undefined} // used가 1인 경우 클릭 이벤트 무시
      style={{
        backgroundColor: isUsed ? 'rgba(255, 0, 0, 0.3)' : 'white', // 사용된 레시피 배경색
        cursor: isActive && isUsed ? 'not-allowed' : 'pointer', // 사용된 레시피는 클릭할 수 없도록 커서 설정
      }}
    >
      <Image
        src={`${import.meta.env.VITE_BASE_SERVER_URL}${data.thumbnailUrl}`}
        alt={data.title}
      />

      {isClicked && (
        <Overlay>
          <CheckIcon style={{ fontSize: '8rem', color: 'white' }} />{' '}
          {/* 아이콘 크기 및 색상 조정 */}
        </Overlay>
      )}

      <CarouselData
        name={data.title}
        price={data.price / data.servings}
        likes={data.favoriteCount}
        score={data.avgRatings}
      />
    </CardContainer>
  );
};

export default CarouselCard;

const CardContainer = styled.div`
  width: 12rem; /* 카드 너비 고정 */
  height: 15rem; /* 카드 높이 고정 */
  min-width: 10rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  transform: ${({ scale }) => scale};
  overflow: hidden; /* 카드 내부 내용이 넘어가는 것 방지 */

  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
    border-color: #374151;
  }
`;

const Image = styled.img`
  width: 192px; /* 이미지 너비 고정 */
  height: 158px; /* 이미지 높이 고정 */
  object-fit: cover; /* 이미지 비율 유지 */
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3); /* 검은색 투명도 30% */
  pointer-events: none; /* 클릭 이벤트가 하위 요소로 전달되도록 설정 */
  z-index: 101; /* 이미지가 가려질 가능성 방지 */
`;
