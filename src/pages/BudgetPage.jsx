import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Layout from '../components/layout/Layout';

const getWeekAndFirstSundayDate = (date) => {
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // 해당 날짜의 주의 일요일을 찾는다
  const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
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

const BudgetPage = () => {
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
    setCurrentDate(newDate);
  };

  const handleIncreaseWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7); // 1주일 더하기
    setCurrentDate(newDate);
  };

  const adjustedDate = new Date(currentDate);
  adjustedDate.setDate(currentDate.getDate() - 7); // 7일 빼기

  return (
    <Layout>
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
        <BudgetSettingContainer>셋팅</BudgetSettingContainer>
        프로세스바
        <BudgetSettingContainer>셋팅</BudgetSettingContainer>
      </BudgetContainer>
      <CalendarContainer>달력</CalendarContainer>
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
