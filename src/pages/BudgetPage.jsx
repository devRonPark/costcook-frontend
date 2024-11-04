import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import BudgetAmountSetting from '../components/common/BudgetAmountSetting';
import WeeklyCalendar from './WeeklyCalendar';
import { useAuth } from '../context/Auth/AuthContext';
import { budgetAPI } from '../services/budget.api';

// 연 단위 주차 계산( 예: 45차 )
const getCurrentYearAndWeek = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMilliseconds = date - startOfYear;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const currentWeek = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);
  return { year: date.getFullYear(), week: currentWeek };
};

// 캘린더 날짜 계산
const getWeekAndFirstSundayDate = (date) => {
  // 오늘 날짜 : date
  const currentYear = date.getFullYear(); // 년
  const currentMonth = date.getMonth(); // 월
  const currentDay = date.getDate(); // 일
  const dayOfWeek = date.getDay(); // 요일 0: 일요일, 1: 월요일, ..., 6: 토요일

  // 해당 날짜의 주의 일요일을 찾는다
  const sundayDate = new Date(date);
  sundayDate.setDate(currentDay - dayOfWeek); // 주의 첫 날인 일요일로 이동

  // 일요일 기준으로 주차 계산
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstSunday = new Date(firstDayOfMonth);
  firstSunday.setDate(
    firstDayOfMonth.getDate() + ((7 - firstDayOfMonth.getDay()) % 7)
  );

  // 일요일을 기준으로 몇 번째 주인지 계산
  const weekOffset = Math.floor(
    (sundayDate.getDate() + sundayDate.getDay()) / 7
  );

  return { week: weekOffset + 1, firstSundayDate: sundayDate };
};

// 예산 집계
const BudgetPage = () => {
  const [budgetData, setbudgetData] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState(0); // 설정한 예산
  const [useAmount, setUseAmount] = useState(0); // 사용한 예산
  const [remainingBudget, setRemainingBudget] = useState(0); // 남은 예산
  const [progress, setProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(0);
  const [firstSundayDateString, setFirstSundayDateString] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  console.log('연: ', year);
  console.log('주차: ', week);

  // 사용 예산 및 레시피 정보 가져오기
  const getUsedWeeklyBudget = async () => {
    try {
      const res = await budgetAPI.getUsedWeeklyBudget(year, week);
      const weeklyBudget = res.data.weeklyBudget; // 설정 예산
      const usedBudget = res.data.usedBudget; // 사용 예산
      const remainingBudget = res.data.remainingBudget; // 남은 예산
      const recipes = res.data.recipes; // 레시피 정보
      console.log('출력 데이터: ', res.data);
      console.log('설정 예산: ', weeklyBudget);
      console.log('사용 예산: ', usedBudget);
      console.log('남은 예산: ', remainingBudget);
      console.log('레시피 정보: ', recipes);
      setbudgetData(res.data);
      setBudgetAmount(weeklyBudget);
      setUseAmount(usedBudget);
    } catch (error) {
      console.error('사용 예산 데이터 출력 중 오류 발생', error);
    }
  };

  useEffect(() => {
    getUsedWeeklyBudget();
  }, [year, week]);

  // useAmount와 budgetAmount에 따른 진행률 계산
  useEffect(() => {
    const newProgress = (useAmount / budgetAmount) * 100;
    setProgress(newProgress);
  }, [useAmount, budgetAmount]);

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

  // 주차 빼기
  const handleDecreaseWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7); // 1주일 빼기
    const sundayDate = new Date(newDate);
    sundayDate.setDate(newDate.getDate() - newDate.getDay());
    setCurrentDate(sundayDate);
  };
  // 주차 더하기
  const handleIncreaseWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7); // 1주일 더하기
    const sundayDate = new Date(newDate);
    sundayDate.setDate(newDate.getDate() - newDate.getDay());
    setCurrentDate(sundayDate);
  };

  return (
    <Layout pageName="예산관리">
      <DateContainer>
        <SplitData>
          <ArrowButton onClick={handleDecreaseWeek}>
            <KeyboardArrowLeftIcon fontSize="large" />
          </ArrowButton>
          <h2>
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
            <BudgetText>예산</BudgetText>
          </BudgetTextContainer>
          <BudgetNumberContainer>
            <BudgetAmountSetting id="useAmount" amount={useAmount} />
            <BudgetAmountSetting id="budgetAmount" amount={budgetAmount} />
          </BudgetNumberContainer>
        </BudgetSettingContainer>
        <ProgressContainer>
          <ProgressBar useAmount={useAmount} budgetAmount={budgetAmount} />
          <ProgressBarTextBox>
            <ProgressBarText>0</ProgressBarText>
            {/* <ProgressBarText>{budgetData[0].budgetAmount}</ProgressBarText> */}
          </ProgressBarTextBox>
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
              // amount={budgetData[0].cheapRecipe}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="recipeAvg"
              // amount={budgetData[0].recipeAvg}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="expensiveRecipe"
              // amount={budgetData[0].expensiveRecipe}
            ></BudgetAmountSetting>
          </BudgetNumberContainer>
        </BudgetSettingContainer>
      </BudgetContainer>
      <CalendarContainer>
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
  border-bottom: 1px black solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
`;

const BudgetSettingContainer = styled.div`
  height: 100px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const BudgetTextContainer = styled.div`
  height: 30px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const BudgetText = styled.div`
  height: 30px;
  width: 50%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BudgetNumberContainer = styled.div`
  height: 50px;
  width: 100%;
  border: 1px black solid;
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

const ProgressBarTextBox = styled.div`
  height: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProgressBarText = styled.div`
  height: 10px;
`;
