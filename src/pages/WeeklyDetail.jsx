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
import { useNavigate } from 'react-router-dom';

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
  const [recipes, setRecipes] = useState([]);
  console.log('유저 정보: ', state?.user);

  // 요리한 레시피 정보 가져오기
  const getUsedRecipes = async () => {
    try {
      const res = await budgetAPI.getUsedWeeklyBudget(year, week);
      const recipes = res.data.recipes || [];
      setRecipes(recipes);
      resetData();
      console.log('사용 레시피 정보: ', recipes);
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
    navigate(`/weeklyDetail/${newYear}/${newWeek}`);
  };

  // 주차 변경 버튼 클릭 핸들러
  const handleDecreaseWeek = () => handleWeekChange(-1);
  const handleIncreaseWeek = () => handleWeekChange(1);

  // 주차 변경 시 데이터 리셋
  const resetData = () => {
    setLowestPriceTitle('');
  };

  return (
    <Layout pageName={'주 간 활동'} isBackBtnExist isSearchBtnExist>
      <div>
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
        <div>요리한 레시피</div>
        <div>
          요리한 레시피 목록(is_used = 1)
          <br />
          (getUsedWeeklyBudget 에서 레시피 목록 가져오기)
        </div>
        <div>추천받은 레시피</div>
        <div>추천받은 레시피 목록(is_used 무관)</div>
      </div>
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
