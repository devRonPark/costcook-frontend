import styled from 'styled-components';
import Checkbox from '@mui/material/Checkbox';
import { COLORS } from '../../utils/constant';

// 재료 아이템을 담는 컨테이너 스타일
const IngredientContainer = styled.div`
  width: 138px; /* 가로 크기 조정: 4개를 배치할 수 있는 크기 */
  height: 138px; /* 세로 크기: 가로 크기와 동일하게 설정 */
  border-radius: 12px; /* 모서리 둥글기 */
  border: 2px solid transparent; /* 초기 투명한 테두리 */
  display: flex;
  flex-direction: column; /* 아이템을 세로로 정렬 */
  align-items: center; /* 아이템을 수평으로 중앙 정렬 */
  justify-content: center; /* 아이템을 수직으로 중앙 정렬 */
  padding: 8px; /* 선택 사항: 내부 여백 추가 */
  background-color: #f9f9f9; /* 선택 사항: 기본 배경색 설정 */
  margin: 8px; /* 아이템 간의 간격 */
  cursor: pointer; /* 클릭 가능한 아이템으로 커서 변경 */
  font-family: 'GmarketSansMedium';

  /* Hover 시 효과 */
  &:hover {
    background-color: #cce7e7;
    border: 2px solid #00796b;
  }

  /* 선호 재료일 때 스타일 */
  &.preferred {
    background-color: ${COLORS.PREFERRED.BACKGROUND};
    border: 2px solid ${COLORS.PREFERRED.BORDER};
  }

  /* 기피 재료일 때 스타일 */
  &.disliked {
    border: 2px solid ${COLORS.DISLIKED.BORDER};
    background-color: ${COLORS.DISLIKED.BACKGROUND};
    cursor: not-allowed;
  }

  /* 화면 너비가 600px 이하일 때 */
  @media (max-width: 600px) {
    max-width: 100px; /* 최대 너비 조정 */
    height: 100px; /* 높이 조정 (가로 세로 비율에 맞춰 조정) */
  }
`;

// 재료 이름을 표시하는 스타일
const IngredientLabel = styled.span`
  margin-top: 8px; /* 아이콘과 이름 간의 공간 */
  font-size: 16px; /* 글자 크기 */
`;

const IngredientItem = ({
  step,
  ingredient,
  preferredIngredients,
  dislikedIngredients,
  handleIngredientChange,
}) => {
  const selectedIngredients = [...preferredIngredients, ...dislikedIngredients];
  const currentStep = step === 1 ? 'dislikedIngredient' : 'preferredIngredient';
  const isSelected =
    selectedIngredients.length > 0 &&
    selectedIngredients.some((i) => i === ingredient.id); // 선택 여부 확인
  const isDisliked =
    dislikedIngredients.length > 0 &&
    dislikedIngredients.some((i) => i === ingredient.id); // 기피 재료 여부 확인
  const isPreferred =
    preferredIngredients.length > 0 &&
    preferredIngredients.some((i) => i === ingredient.id); // 선호 재료 여부 확인

  const getIngredientClassName = () => {
    // 현재 단계가 "dislikedIngredient"일 때
    if (currentStep === 'dislikedIngredient') {
      if (isSelected) {
        if (isDisliked) return 'disliked';
        if (isPreferred) return 'preferred';
      }
      return ''; // 선택되지 않은 경우 빈 문자열 반환
    }

    // 현재 단계가 "preferredIngredient"일 때
    if (currentStep === 'preferredIngredient') {
      if (isSelected) {
        if (isDisliked) return 'disliked';
        if (isPreferred) return 'preferred';
      }
      return ''; // 선택되지 않은 경우 빈 문자열 반환
    }

    // 예외 처리: 해당되지 않는 경우 빈 문자열 반환
    return '';
  };

  return (
    <IngredientContainer
      className={getIngredientClassName()}
      onClick={() => handleIngredientChange(currentStep, ingredient.id)} // 클릭 시 핸들러
    >
      {/* 체크박스는 숨김 처리 */}
      <Checkbox
        checked={isSelected}
        onChange={() => handleIngredientChange(currentStep, ingredient.id)} // 체크박스 변경 핸들러
        style={{ display: 'none' }} // 체크박스를 화면에 보이지 않게 설정
      />
      <img
        src={ingredient.imageUrl}
        alt={ingredient.name}
        width={40}
        height={40}
      />{' '}
      {/* 재료 아이콘 */}
      <IngredientLabel>{ingredient.name}</IngredientLabel> {/* 재료 이름 */}
    </IngredientContainer>
  );
};

export default IngredientItem;
