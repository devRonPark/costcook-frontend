import { Typography } from '@mui/material';
import styled from 'styled-components';
import IngredientSelectionList from './display/IngredientSelectionList';
import { COLORS } from '../utils/constant';

// 제목 스타일
const Title = styled(Typography)`
  font-size: 30px !important;
  font-family: 'RixXladywatermelonR' !important;
  font-weight: bold;
  text-align: center;
  color: ${({ step }) =>
    step === 1
      ? COLORS.DISLIKED.COLOR
      : step === 2
      ? COLORS.PREFERRED.COLOR
      : 'black'} !important;
  margin-bottom: 60px !important;
`;

// handleChange: (field = "preferredIngredients" or "dislikedIngredients", value) => {}
// value: {id: 1, name: ""}
const IngredientSelection = ({
  step,
  ingredients,
  preferredIngredients,
  dislikedIngredients,
  handleChange, // 재료 선택 처리 함수
  margin,
}) => {
  // step 이 2 일 때 즉 선호 재료 선택하는 화면에서 이전 화면에서 기피 재료로 선택된 재료 항목에 대해서 사용자가 선택하지 못하도록 처리함과 동시에 그에 적절한 스타일링을 하고 싶어.
  // 예시) 기피 재료로 선택한 항목: border 를 진한 빨간색, background-color 를 연한 빨간색. 해당 항목에 커서 접근시 cursor: not-allowed 설정
  return (
    <div style={{ margin: margin ?? '0' }}>
      <Title step={step}>이런 음식은 {step === 1 ? '싫어요' : '좋아요'}</Title>
      <IngredientSelectionList
        step={step}
        ingredients={ingredients}
        preferredIngredients={preferredIngredients}
        dislikedIngredients={dislikedIngredients}
        handleIngredientChange={handleChange}
      />
    </div>
  );
};

export default IngredientSelection;
