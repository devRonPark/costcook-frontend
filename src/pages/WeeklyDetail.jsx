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
          <ArrowButton
            onClick={handleIncreaseWeek}
            isCurrentWeek={isCurrentWeek}
          >
            <KeyboardArrowRightIcon fontSize="large" />
          </ArrowButton>
        </SplitData>
      </DateContainer>
      <RecipeListBox>
        <RecipeListText>추천받은 레시피</RecipeListText>
        {recommendedRecipes.length > 0 ? (
          <>
            <div style={{ overflow: 'hidden' }}>
              <BudgetRecipeSlide recipes={recommendedRecipes} />
            </div>
          </>
        ) : (
          <>
            <EmptyBox></EmptyBox>
            <NoRecipeListText>추천받은 레시피가 없습니다.</NoRecipeListText>
            <EmptyBox></EmptyBox>
          </>
        )}
      </RecipeListBox>
      <RecipeListBox>
        <RecipeListText>요리한 레시피</RecipeListText>
        {usedRecipes.length > 0 ? (
          <>
            <div style={{ overflow: 'hidden' }}>
              <BudgetRecipeSlide recipes={usedRecipes} />
            </div>
          </>
        ) : (
          <>
            <EmptyBox></EmptyBox>
            <NoRecipeListText>요리한 레시피가 없습니다.</NoRecipeListText>
            <EmptyBox></EmptyBox>

            {isCurrentWeek && ( // 현재 주차에서만 표시
              <LinkButtonWrapper>
                <LinkButton onClick={() => navigate('/home')}>
                  <UseRecipeLinkText>
                    아직 요리한 레시피가 없네요! <br /> 요리하러 가볼까요?
                  </UseRecipeLinkText>
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
  color: ${({ isCurrentWeek }) => (isCurrentWeek ? '#b0b0b0' : 'initial')};
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

const NoRecipeListText = styled.div`
  font-size: 30px;
  text-align: center;
  color: #888888;
  font-family: 'GangwonEduPowerExtraBoldA';
`;
const EmptyBox = styled.div`
  height: 93px;
`;

const LinkButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LinkButton = styled.button`
  width: 90%;
  text-align: center;
  border: 0px solid white;
  border-radius: 20px;
  font-size: 32px;
  padding: 10px;
  font-family: 'GangwonEduPowerExtraBoldA';
  overflow: hidden;
  background-color: #ffd700;
  color: white;
`;

const UseRecipeLinkText = styled.p`
  margin: 5px;
  padding-top: 10px;
  line-height: 1.5;
  text-shadow: 1px 1px 0px #888888, /* 위쪽 */ -1px -1px 0px #888888,
    /* 왼쪽 아래 */ 1px -1px 0px #888888, /* 오른쪽 아래 */ -1px 1px 0px #888888; /* 왼쪽 위 */
`;
