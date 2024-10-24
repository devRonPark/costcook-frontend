import { Typography } from '@mui/material';
import styled from 'styled-components';
import IngredientSelectionList from './display/IngredientSelectionList';

// 제목 스타일
const Title = styled(Typography)`
  font-size: 24px !important;
  font-weight: bold;
  text-align: center;
  color: #007bff;
  margin-bottom: 60px !important;
`;

const IngredientSelection = ({
  step,
  ingredients,
  userTaste,
  setUserTaste,
}) => {
  // 재료 선택 처리 함수
  // ingredient: {id: 1, name: ""}
  const handleChange = (ingredient) => {
    if (step === 1) {
      // 기피 재료 선택하는 경우,
      // preferences에 포함되어 있으면 dislikedIngredients에 추가하지 않음
      setUserTaste((prev) => {
        // preferences에 포함되어 있으면 그대로 유지
        if (prev.preferences.some((i) => i.id === ingredient.id)) {
          return prev; // 그대로 유지
        }

        // dislikedIngredients에 포함되어 있으면 제거
        if (prev.dislikedIngredients.some((i) => i.id === ingredient.id)) {
          return {
            ...prev,
            dislikedIngredients: prev.dislikedIngredients.filter(
              (i) => i.id !== ingredient.id
            ),
          };
        }

        // 포함되어 있지 않으면 추가
        return {
          ...prev,
          dislikedIngredients: [...prev.dislikedIngredients, ingredient], // dislikedIngredients 업데이트
        };
      });
    } else if (step === 2) {
      // 선호 재료 선택하는 경우,
      setUserTaste((prev) => {
        // dislikedIngredients에 포함되어 있으면 preferences에 추가하지 않음
        if (prev.dislikedIngredients.some((i) => i.id === ingredient.id)) {
          return prev; // 그대로 유지
        }

        // preferences에 포함되어 있으면 제거
        if (prev.preferences.some((i) => i.id === ingredient.id)) {
          return {
            ...prev,
            preferences: prev.preferences.filter((i) => i.id !== ingredient.id),
          };
        }

        // 포함되어 있지 않으면 추가
        return {
          ...prev,
          preferences: [...prev.preferences, ingredient],
        };
      });
    }
  };

  // step 이 2 일 때 즉 선호 재료 선택하는 화면에서 이전 화면에서 기피 재료로 선택된 재료 항목에 대해서 사용자가 선택하지 못하도록 처리함과 동시에 그에 적절한 스타일링을 하고 싶어.
  // 예시) 기피 재료로 선택한 항목: border 를 진한 빨간색, background-color 를 연한 빨간색. 해당 항목에 커서 접근시 cursor: not-allowed 설정
  return (
    <div>
      <Title>이런 음식은 {step === 1 ? '싫어요' : '좋아요'}</Title>
      <IngredientSelectionList
        step={step}
        ingredients={ingredients}
        selectedIngredients={[
          ...userTaste.preferences,
          ...userTaste.dislikedIngredients,
        ]}
        preferences={userTaste.preferences}
        dislikedIngredients={userTaste.dislikedIngredients}
        handleIngredientChange={handleChange}
      />
    </div>
  );
};

export default IngredientSelection;
