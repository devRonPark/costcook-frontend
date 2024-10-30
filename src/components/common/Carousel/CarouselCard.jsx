import styled from 'styled-components';
import CarouselData from './CarouselData';

const CardContainer = styled.div`
  min-width: 10rem;
  background-color: white; /* bg-white */
  border: 1px solid #e5e7eb; /* border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow */
  transition: all 0.2s ease-in-out; /* transition-all duration-300 ease-in-out */
  transform: ${({ scale }) => scale}; /* scale 효과 */

  /* 다크 모드 스타일 */
  @media (prefers-color-scheme: dark) {
    background-color: #1f2937; /* dark:bg-gray-800 */
    border-color: #374151; /* dark:border-gray-700 */
  }
`;

const Image = styled.img`
  border-top-left-radius: 0.5rem; /* rounded-t-lg */
  border-top-right-radius: 0.5rem; /* rounded-t-lg */
`;

const CarouselCard = ({ isActive, isPrev, isNext, data }) => {
  // isActive, isPrev, isNext 상태에 따라 CSS scale 값을 반환
  const getScale = () => {
    if (isActive) return 'scale(1)'; // scale-100
    if (isPrev || isNext) return 'scale(0.9)'; // scale-90
    return 'scale(0.8)'; // scale-75
  };

  // scr = data.title, alt = data.alt , 음식이름 = name , 음식가격 = price, 북마크 = likes , 별점 = score
  return (
    <CardContainer scale={getScale()}>
      <Image src={data.title} alt={data.alt} />
      <CarouselData
        name="음식이름"
        price={8000}
        likes={2}
        score={4.5}
      ></CarouselData>
    </CardContainer>
  );
};

export default CarouselCard;
