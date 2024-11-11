import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { budgetAPI } from '../services/budget.api';
import { useAuth } from '../context/Auth/AuthContext';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { BudgetRecipeSlide } from '../components/display/BudgetRecipeSlide';
import { recommendAPI } from '../services/recommend.api';
import { toast } from 'react-toastify';

// 날짜 계산 (헤더에 날짜 표시)
const WeeklyDetail = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [usedRecipes, setUsedRecipes] = useState([]); // 사용 레시피
  const [recommendedRecipes, setRecommendedRecipes] = useState([]); // 추천받은 레시피
  const location = useLocation();
  const { year, week, weekNumber, currentMonth, isCurrentWeek } =
    location.state || {};

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
      console.error('비 로그인 상태', error);
    }
  };

  // 요리한 레시피 정보 가져오기(is_used = 1)
  const getUsedRecipes = async () => {
    try {
      const usedRes = await budgetAPI.getUsedWeeklyBudget(year, week);
      const usedRecipes = usedRes.data.recipes || [];
      setUsedRecipes(usedRecipes);
    } catch (error) {
      console.error('데이터를 불러올 수 없음', error);
    }
  };

  useEffect(() => {
    getUsedRecipes();
    getRecommendedRecipes();
  }, [year, week]);

  // 레시피 미사용시, 홈으로 보내는 버튼 클릭 시 toast 출력
  const handleLinkCilck = () => {
    navigate('/home');
    toast.info('추천받은 레시피를 선택하여\n 요리해보세요!', {
      className: 'custom-toast',
    });
  };

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
          <h2 style={{ fontFamily: 'yg-jalnan' }}>
            {year}년 {currentMonth} {weekNumber}주차
          </h2>
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
                <LinkButton onClick={handleLinkCilck}>
                  <UseRecipeLinkText>
                    아직 요리한 레시피가 없네요! 요리하러 갈까요?
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
  background-color: #fef2b0;
  color: white;
`;

const UseRecipeLinkText = styled.p`
  margin: 5px;
  padding-top: 10px;
  line-height: 1.5;
  text-shadow: 1px 1px 0px #888888, /* 위쪽 */ -1px -1px 0px #888888,
    /* 왼쪽 아래 */ 1px -1px 0px #888888, /* 오른쪽 아래 */ -1px 1px 0px #888888; /* 왼쪽 위 */
`;
