import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { budgetAPI } from '../services/budget.api';
import { useAuth } from '../context/Auth/AuthContext';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  getCurrentYearAndWeek,
  getWeekAndFirstSundayDate,
} from '../utils/dateUtil';
import { Link, useNavigate } from 'react-router-dom';
import { RecipeSlide } from '../components/display/RecipeSlide';
import { recommendAPI } from '../services/recommend.api';

// 날짜 계산 (헤더에 날짜 표시)

const WeeklyDetail = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(0);
  const [firstSundayDateString, setFirstSundayDateString] = useState('');
  const [usedRecipes, setUsedRecipes] = useState([]); // 사용 레시피
  const [recommendedRecipes, setRecommendedRecipes] = useState([]); // 추천받은 레시피
  console.log('유저 정보: ', state?.user);

  // 추천받은 레시피 정보 가져오기(is_used 무관)
  const getRecommendedRecipes = async () => {
    try {
      const recommendedRes = await recommendAPI.getRecommendedRecipes(
        year,
        week
      );
      const recommendedRecipes = recommendedRes.data.recipes || [];
      setRecommendedRecipes(recommendedRecipes);
      console.log('추천받은 레시피 정보 : ', recommendedRecipes);
    } catch (error) {
      console.log('데이터 출력 중 오류 발생', error);
    }
  };

  // 요리한 레시피 정보 가져오기(is_used = 1)
  const getUsedRecipes = async () => {
    try {
      const usedRes = await budgetAPI.getUsedWeeklyBudget(year, week);
      const usedRecipes = usedRes.data.recipes || [];
      setUsedRecipes(usedRecipes);
      console.log('사용 레시피 정보: ', usedRecipes);
    } catch (error) {
      console.error('데이터 출력 중 오류 발생', error);
    }
  };

  useEffect(() => {
    console.log('월', currentMonth);
    console.log('주차', weekNumber);
    console.log('연', year);
    console.log('주차', week);
    getUsedRecipes();
    getRecommendedRecipes();
  }, [year, week]);

  useEffect(() => {
    const { week, firstSundayDate } = getWeekAndFirstSundayDate(currentDate);
    setWeekNumber(week);
    setFirstSundayDateString(firstSundayDate.toLocaleDateString());

    // 현재 월 설정
    const monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];
    setCurrentMonth(monthNames[firstSundayDate.getMonth()]); // 일요일 기준으로 현재 월을 설정
  }, [currentDate]);

  // 주차 변경 버튼 함수
  const handleWeekChange = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + delta * 7); // 1주일 더하기 또는 빼기
    const { year: newYear, week: newWeek } = getCurrentYearAndWeek(newDate);
    setCurrentDate(newDate);
    setYear(newYear);
    setWeek(newWeek);
    console.log('newYear:', newYear);
    console.log('newWeek:', newWeek);
  };

  // 주차 변경 버튼 클릭 핸들러
  const handleDecreaseWeek = () => handleWeekChange(-1);
  const handleIncreaseWeek = () => handleWeekChange(1);

  return (
    <Layout pageName={'주 간 활동'} isBackBtnExist isSearchBtnExist>
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
      <div>{state.user?.nickname}님의 주간 활동</div>
      <div>추천받은 레시피</div>
      <div>
        <RecipeSlide recipes={recommendedRecipes} />
      </div>
      <br />
      <br />
      <br />
      <br />

      <div>요리한 레시피</div>
      <RecipeSlide recipes={usedRecipes} />
    </Layout>
  );
};

export default WeeklyDetail;

const DateContainer = styled.div`
  height: 80px;
  width: 100%;
  border-bottom: 1px black solid;
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
