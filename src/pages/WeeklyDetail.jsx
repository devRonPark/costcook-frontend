import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { budgetAPI } from '../services/budget.api';
import { useAuth } from '../context/Auth/AuthContext';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import { BudgetRecipeSlide } from '../components/display/BudgetRecipeSlide';
import { recommendAPI } from '../services/recommend.api';
import { useWeeklyDate } from '../hooks/useWeeklyDate';

// 날짜 계산 (헤더에 날짜 표시)
const WeeklyDetail = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [usedRecipes, setUsedRecipes] = useState([]); // 사용 레시피
  const [recommendedRecipes, setRecommendedRecipes] = useState([]); // 추천받은 레시피

  // 날짜 관리 훅 가져오기
  const {
    year,
    week,
    currentMonth,
    weekNumber,
    isCurrentWeek,
    handleDecreaseWeek,
    handleIncreaseWeek,
  } = useWeeklyDate();

  // 추천받은 레시피 정보 가져오기(is_used 무관)
  const getRecommendedRecipes = async () => {
    try {
      const recommendedRes = await recommendAPI.getRecommendedRecipes(
        year,
        week
      );
      const recommendedRecipes = recommendedRes.data.recipes || [];
      setRecommendedRecipes(recommendedRecipes);
    } catch (error) {
      console.log('비 로그인 상태');
    }
  };

  // 요리한 레시피 정보 가져오기(is_used = 1)
  const getUsedRecipes = async () => {
    try {
      const usedRes = await budgetAPI.getUsedWeeklyBudget(year, week);
      const usedRecipes = usedRes.data.recipes || [];
      setUsedRecipes(usedRecipes);
    } catch (error) {
      console.log('데이터를 불러올 수 없음');
    }
  };

  useEffect(() => {
    getUsedRecipes();
    getRecommendedRecipes();
  }, [year, week]);

  return (
    <Layout
      pageName={`${
        state.user?.nickname
          ? `${state.user?.nickname} 님의 주간 활동`
          : '주간 활동'
      }`}
      isBackBtnExist
      isSearchBtnExist
    >
      <DateContainer>
        <SplitData>
          <ArrowButton onClick={handleDecreaseWeek}>
            <KeyboardArrowLeftIcon fontSize="large" />
          </ArrowButton>
          <h2 style={{ fontFamily: 'yg-jalnan' }}>
            {currentMonth} {weekNumber}주차
          </h2>
          <ArrowButton onClick={handleIncreaseWeek}>
            <KeyboardArrowRightIcon fontSize="large" />
          </ArrowButton>
        </SplitData>
      </DateContainer>
      <RecipeListBox>
        {recommendedRecipes.length > 0 ? (
          <>
            <RecipeListText>추천받은 레시피</RecipeListText>
            <div style={{ overflow: 'hidden' }}>
              <BudgetRecipeSlide recipes={recommendedRecipes} />
            </div>
          </>
        ) : (
          <>
            <RecipeListText>추천받은 레시피가 없습니다.</RecipeListText>
          </>
        )}
      </RecipeListBox>
      <br />
      <br />
      <br />
      <RecipeListBox>
        {usedRecipes.length > 0 ? (
          <>
            <RecipeListText>요리한 레시피</RecipeListText>
            <div style={{ overflow: 'hidden' }}>
              <BudgetRecipeSlide recipes={usedRecipes} />
            </div>
          </>
        ) : (
          <>
            <RecipeListText>요리한 레시피가 없습니다.</RecipeListText>
            <br />
            <br />
            {isCurrentWeek && ( // 현재 주차에서만 표시
              <LinkButtonWrapper>
                <LinkButton onClick={() => navigate('/home')}>
                  <p style={{ margin: '5px' }}>
                    아직 요리한 레시피가 없네요! 요리하러 갈까요?
                  </p>
                </LinkButton>
              </LinkButtonWrapper>
            )}
          </>
        )}
      </RecipeListBox>
    </Layout>
  );
};

export default WeeklyDetail;

const DateContainer = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
`;

const SplitData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ArrowButton = styled.div`
  cursor: pointer;
`;

const RecipeListBox = styled.div`
  width: 95%;
  margin-bottom: 10px;
  text-align: left;
`;
const RecipeListText = styled.div`
  font-family: 'yg-jalnan';
  font-size: 18px;
  margin-bottom: 10px;
`;

const LinkButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LinkButton = styled.button`
  width: 100%;
  height: 30px;
  display: block;
  background-color: #e0e0e0;
  text-align: center;
  border: 0px solid white;
  border-radius: 10px;
  font-size: 20px;
  padding: 3px;
  font-family: 'GangwonEduPowerExtraBoldA';
  color: orange;
  overflow: hidden;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ffd700; // hover 시 진한 노란색
    color: white;
  }
`;
