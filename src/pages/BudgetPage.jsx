import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import BudgetAmountSetting from '../components/common/BudgetAmountSetting';
import WeeklyCalendar from './WeeklyCalendar';

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

// progressBar 부분

const budgetData = [
  {
    id: 1,
    useAmount: 88000,
    budgetAmount: 100000,
    cheapRecipe: 5000,
    recipeAvg: 18000,
    expensiveRecipe: 20000,
    date: '2024-10-23',
  },
  {
    id: 2,
    useAmount: 50000,
    budgetAmount: 80000,
    date: '2024-10-30',
  },
];

const BudgetPage = () => {
  const [useAmount, setUseAmount] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 구조 분해 할당 시 다른 변수 이름 사용
    const { useAmount: initialUse, budgetAmount: initialBudget } =
      budgetData[0];
    setUseAmount(initialUse);
    setBudgetAmount(initialBudget);
  }, []);

  // useAmount와 budgetAmount에 따른 진행률 계산
  useEffect(() => {
    const newProgress = (useAmount / budgetAmount) * 100;
    setProgress(newProgress);
  }, [useAmount, budgetAmount]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(0);
  const [firstSundayDateString, setFirstSundayDateString] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');

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

  const handleDecreaseWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7); // 1주일 빼기
    const sundayDate = new Date(newDate);
    sundayDate.setDate(newDate.getDate() - newDate.getDay());
    setCurrentDate(sundayDate);
  };

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
            <BudgetAmountSetting
              id="useAmount"
              amount={budgetData[0].useAmount}
            />
            <BudgetAmountSetting
              id="budgetAmount"
              amount={budgetData[0].budgetAmount}
            />
          </BudgetNumberContainer>
        </BudgetSettingContainer>
        <ProgressContainer>
          <ProgressBar useAmount={useAmount} budgetAmount={budgetAmount} />
          <ProgressBarTextBox>
            <ProgressBarText>0</ProgressBarText>
            <ProgressBarText>{budgetData[0].budgetAmount}</ProgressBarText>
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
              amount={budgetData[0].cheapRecipe}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="recipeAvg"
              amount={budgetData[0].recipeAvg}
            ></BudgetAmountSetting>
            <BudgetAmountSetting
              id="expensiveRecipe"
              amount={budgetData[0].expensiveRecipe}
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
