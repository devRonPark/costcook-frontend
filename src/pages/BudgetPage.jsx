import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import BudgetAmountSetting from '../components/common/BudgetAmountSetting';
import WeeklyCalendar from './WeeklyCalendar';
import { budgetAPI } from '../services/budget.api';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentYearAndWeek,
  getWeekAndFirstSundayDate,
} from '../utils/dateUtil';

// 예산 집계
const BudgetPage = () => {
  const [budgetAmount, setBudgetAmount] = useState(0); // 설정한 예산
  const [useAmount, setUseAmount] = useState(0); // 사용한 예산
  const [remainingBudget, setRemainingBudget] = useState(0); // 남은 예산
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(0);
  const [firstSundayDateString, setFirstSundayDateString] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  const [recipes, setRecipes] = useState([]);
  const [highestPrice, setHighestPrice] = useState(0); // 가장 비싼 레시피 가격
  const [lowestPrice, setLowestPrice] = useState(0); // 가장 저렴한 레시피 가격
  const [averagePrice, setAveragePrice] = useState(0); // 평균 레시피 가격
  const [highestPriceTitle, setHighestPriceTitle] = useState(''); // 가장 비싼 레시피 제목
  const [lowestPriceTitle, setLowestPriceTitle] = useState(''); // 가장 싼 레시피 제목
  const [highestRecipeId, setHighestRecipeId] = useState(null); // 가장 비싼 레시피 ID
  const [lowestRecipeId, setLowestRecipeId] = useState(null); // 가장 저렴한 레시피 ID
  const navigate = useNavigate();

  // 사용 예산 및 레시피 정보 가져오기
  const getUsedWeeklyBudget = async () => {
    try {
      const res = await budgetAPI.getUsedWeeklyBudget(year, week);
      const weeklyBudget = res.data.weeklyBudget || 0; // 설정 예산
      const usedBudget = res.data.usedBudget || 0; // 사용 예산
      const remainingBudget = weeklyBudget - usedBudget; // 남은 예산
      const recipes = res.data.recipes || []; // 레시피 정보
      setBudgetAmount(weeklyBudget);
      setUseAmount(usedBudget);
      setRemainingBudget(remainingBudget);
      setRecipes(recipes);
      resetData();
      calculatePrices(recipes); // 함수에 recipes를 보냄
      console.log('getUsedWeeklyBudget_year : ', year);
      console.log('getUsedWeeklyBudget_week : ', week);
    } catch (error) {
      console.error('사용 예산 데이터 출력 중 오류 발생', error);
    }
  };
  // 레시피 가격 통계
  const calculatePrices = (recipes) => {
    if (recipes.length === 0) {
      console.log('레시피 정보 없음');
      return;
    }
    const prices = recipes.map((recipe) => recipe.price);
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);
    const average =
      prices.reduce((acc, price) => acc + price, 0) / prices.length;

    setHighestPrice(highest);
    setLowestPrice(lowest);
    setAveragePrice(average);
    const highestRecipe = recipes.find((recipe) => recipe.price === highest); // 가장 비싼 레시피이름
    const lowestRecipe = recipes.find((recipe) => recipe.price === lowest); // 가장 싼 레시피 이름
    setHighestPriceTitle(highestRecipe ? highestRecipe.title : '');
    setLowestPriceTitle(lowestRecipe ? lowestRecipe.title : '');
    setHighestRecipeId(highestRecipe.id); // 가장 비싼 레시피 ID
    setLowestRecipeId(lowestRecipe.id); // 가장 저렴한 레시피 ID
  };

  useEffect(() => {
    getUsedWeeklyBudget();
    console.log(year);
    console.log(week);
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
  };
  // 주차 변경 버튼 클릭 핸들러
  const handleDecreaseWeek = () => handleWeekChange(-1);
  const handleIncreaseWeek = () => handleWeekChange(1);

  // 주차 변경 시 데이터 리셋
  const resetData = () => {
    setHighestPrice(0);
    setLowestPrice(0);
    setAveragePrice(0);
    setHighestPriceTitle('');
    setLowestPriceTitle('');
    console.log('year: ', year);
    console.log('week: ', week);
    console.log('weekNumber: ', weekNumber);
    console.log('currentMonth: ', currentMonth);
  };

  // 달력 클릭 시 주차 상세 페이지 이동
  const handleCalendarClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // 모달 확인 버튼 클릭 시 처리
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate('/weekly-details', {
      state: { year, weekNumber, week, currentMonth, isCurrentWeek },
    });
    console.log('state_year_ : ', year);
    console.log('state_week_ : ', week);
    console.log('state_weekNumber_ : ', weekNumber);
  };

  return (
    <Layout pageName="예산관리" isSearchBtnExist>
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
      <BudgetContainer>
        <BudgetSettingContainer>
          <BudgetTextContainer>
            <BudgetText>사용금액</BudgetText>
            <BudgetText>남은예산</BudgetText>
          </BudgetTextContainer>
          <BudgetNumberContainer>
            <BudgetAmountSetting id="useAmount" amount={useAmount} />
            <BudgetAmountSetting
              id="remainingBudget"
              amount={remainingBudget}
            />
          </BudgetNumberContainer>
        </BudgetSettingContainer>
        <ProgressContainer>
          <ProgressBar useAmount={useAmount} budgetAmount={budgetAmount} />
        </ProgressContainer>

        <BudgetSettingContainer>
          <BudgetTextContainer>
            <BudgetText>가장 저렴한 레시피</BudgetText>
            <BudgetText>레시피 평균 가격</BudgetText>
            <BudgetText>가장 비싼 레시피</BudgetText>
          </BudgetTextContainer>
          <BudgetNumberContainer>
            <BudgetAmountSetting
              id="cheapRecipe"
              amount={lowestPrice}
              title={lowestPriceTitle}
              recipeId={lowestRecipeId}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="recipeAvg"
              amount={averagePrice}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="expensiveRecipe"
              amount={highestPrice}
              title={highestPriceTitle}
              recipeId={highestRecipeId}
            ></BudgetAmountSetting>
          </BudgetNumberContainer>
        </BudgetSettingContainer>
      </BudgetContainer>
      <CalendarContainer onClick={handleCalendarClick}>
        <WeeklyCalendar currentDate={currentDate}>달력</WeeklyCalendar>
      </CalendarContainer>
    </Layout>
  );
};

export default BudgetPage;

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

const BudgetContainer = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
`;

const BudgetSettingContainer = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const BudgetTextContainer = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const BudgetText = styled.div`
  font-family: 'GangwonEdu_OTFBoldA';
  font-size: 18px;
  height: 30px;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BudgetNumberContainer = styled.div`
  font-family: 'BMJUA';
  font-size: 18px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const CalendarContainer = styled.div`
  height: 392px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const ArrowButton = styled.div`
  cursor: pointer;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
`;
