import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Carousel from '../components/common/Carousel/Carousel';
import { useLocation, useNavigate } from 'react-router-dom';
import { recommendAPI } from '../services/recommend.api';

const RecommendPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const budget = location.state.budget;
  const year = location.state.year;
  const week = location.state.week;
  const userId = location.state.userId;
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(budget);

  console.log(year);
  console.log(week);

  // 선택된 레시피 가격의 합을 계산하여 남은 예산을 업데이트하는 함수
  const updateRemainingBudget = (newSelectedRecipes) => {
    const totalSelectedCost = newSelectedRecipes.reduce(
      (sum, recipe) => sum + recipe.price, // 레시피의 가격 속성을 이용해 합계 계산
      0
    );
    setRemainingBudget(budget - totalSelectedCost);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      // 이미 선택된 레시피가 있으면 제거, 없으면 추가
      const isSelected = prevSelected.some((item) => item.id === recipe.id);
      const newSelectedRecipes = isSelected
        ? prevSelected.filter((item) => item.id !== recipe.id) // 선택 해제 시
        : [...prevSelected, recipe]; // 선택 추가 시
      updateRemainingBudget(newSelectedRecipes); // 남은 예산 업데이트
      return newSelectedRecipes;
    });
  };

  const handleRemoveSelectRecipe = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      const newSelectedRecipes = prevSelected.filter((r) => r.id !== recipe.id);
      updateRemainingBudget(newSelectedRecipes); // 남은 예산 업데이트
      return newSelectedRecipes;
    });
  };

  // 선택한 레시피를 DB에 저장하는 함수
  const handleCompleteSelection = async () => {
    const recommendedRecipes = selectedRecipes.map((recipe) => ({
      year,
      weekNumber: week,
      recipeId: recipe.id,
      is_used: false,
      userId: userId,
    }));

    console.log(recommendedRecipes);
    try {
      const response = await recommendAPI.saveRecommendedRecipes(
        recommendedRecipes
      );
      console.log('API Response:', response);
      if (response.status === 201) {
        alert('레시피가 성공적으로 추천 목록에 추가되었습니다.');
        navigate('/Home');
      } else {
        alert('레시피 추가 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <Layout>
      <SelectedContainer>
        <SelectedListContainer>
          {selectedRecipes.length === 0 ? (
            <PlaceholderText>선택된 레시피 리스트가 출력됩니다</PlaceholderText> // 선택된 항목이 없을 때 placeholder 표시
          ) : (
            selectedRecipes.map((recipe) => (
              <SelectedList
                key={recipe.id}
                isSelected={selectedRecipes.some(
                  (item) => item.id === recipe.id
                )} // 선택 상태 전달
                onClick={() => handleRemoveSelectRecipe(recipe)}
              >
                <SelectedImage
                  src={`http://localhost:8080${recipe.thumbnailUrl}`}
                  alt={recipe.title}
                />
                <SelectedText>{recipe.title}</SelectedText>
              </SelectedList>
            ))
          )}
        </SelectedListContainer>
      </SelectedContainer>

      <RecommendContainer>
        <h4>40%이내 가격의 레시피들</h4>
        <RecommendListContainer>
          <Carousel
            budget={budget}
            selectedRecipes={selectedRecipes}
            onSelect={handleSelectRecipe}
            remainingBudget={remainingBudget}
          />
        </RecommendListContainer>
      </RecommendContainer>

      <RecommendContainer>
        <h4>20%이내 가격의 레시피들</h4>
        <RecommendListContainer>
          <Carousel
            budget={budget * 0.5}
            selectedRecipes={selectedRecipes}
            onSelect={handleSelectRecipe}
            remainingBudget={remainingBudget}
          />
        </RecommendListContainer>
      </RecommendContainer>
      <ShowBasicContainer>
        <ShowContainer>
          남은 금액 : {remainingBudget.toLocaleString()}원
        </ShowContainer>
        <ShowContainer>
          <button onClick={handleCompleteSelection}>선택 완료</button>
        </ShowContainer>
      </ShowBasicContainer>
    </Layout>
  );
};

export default RecommendPage;

const SelectedContainer = styled.div`
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  border: 1px black solid;
  text-align: center;
  overflow: hidden; /* 카드 내부 내용이 넘어가는 것 방지 */
  max-height: 160px; /* 고정된 최대 높이 설정 */
`;

const SelectedListContainer = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  overflow-x: auto; /* 수평 스크롤 허용 */
  white-space: nowrap; /* 카드가 줄바꿈되지 않도록 설정 */
`;

const PlaceholderText = styled.div`
  height: 120px; /* SelectedList와 동일한 높이 설정 */
  width: 100px; /* SelectedList와 동일한 너비 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray; /* 회색 텍스트 색상 */
  font-style: italic; /* 이탤릭체로 표시 */
  text-align: center;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 5px;
  height: 120px;
  width: 100px;
`;
const SelectedImage = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
`;
const SelectedText = styled.div`
  height: 20px;
  width: 100px;
  /* 긴 텍스트가 잘리도록 설정 */
  white-space: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 부분 숨기기 */
  text-overflow: ellipsis; /* 잘릴 때 '...'으로 표시 */
  width: 100%; /* 가로 크기 설정 */
`;

const RecommendContainer = styled.div`
  padding-top: 5px;
  width: 100%;
  /* border: 1px solid black; */
  text-align: left;
  display: flex;
  flex-direction: column;
`;
const RecommendListContainer = styled.div`
  padding-top: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  /* border: 1px solid black; */
`;

const ShowBasicContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
  border: 1px black solid;
`;

const ShowContainer = styled.div`
  height: 60px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-top: auto;
  border: 1px black solid;
`;
