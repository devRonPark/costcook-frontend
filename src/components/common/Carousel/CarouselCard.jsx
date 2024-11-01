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
  useEffect(() => {
    setIsClicked(selectedRecipes?.includes(data));
  }, [selectedRecipes]);

  // // 카드 클릭 시 상태 변경 함수
  const handleCardClick = () => {
    console.log(remainingBudget);
    if (remainingBudget >= data.price) {
      if (isActive) onSelect(data);
    } else {
      if (isActive) {
        toast.error(`예산을 초과했습니다.`);
      }
    }
  };

  // isActive, isPrev, isNext 상태에 따라 CSS scale 값을 반환
  const getScale = () => {
    if (isActive) return 'scale(1)';
    if (isPrev || isNext) return 'scale(0.9)';
    return 'scale(0.8)';
  };

  return (
    <CardContainer scale={getScale()} onClick={() => handleCardClick()}>
      <Image
        src={`http://localhost:8080${data.thumbnailUrl}`}
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
        price={data.price}
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
