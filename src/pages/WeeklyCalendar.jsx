import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import moment from 'moment';

const StyledCalendar = styled(Calendar)`
  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  /* 오늘 날짜 폰트 컬러 */
  .react-calendar__tile--now {
    background: none;
    abbr {
      color: ${(props) => props.theme.primary_2};
    }
  }

  /* 선택된 주 배경색 */
  .react-calendar__tile--active {
    background-color: yellow; /* 선택된 주 배경색 */
    color: black; /* 선택된 주 텍스트 색상 */
  }
`;

const WeekCalendar = () => {
  const today = new Date();
  const [value, setValue] = useState(today);

  const onChange = (newDate) => {
    setValue(newDate);
  };

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day; // 일요일 시작
    start.setDate(diff);
    return start;
  };

  const tileClassName = ({ date }) => {
    const start = getStartOfWeek(value);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 주의 끝 (토요일)

    // 선택된 주에 해당하는 날짜인지 확인
    if (date >= start && date <= end) {
      return 'react-calendar__tile--active'; // 전체 주 색칠
    }

    return null; // 기본적으로 null을 반환
  };

  return (
    <div>
      <StyledCalendar
        onChange={onChange}
        value={value}
        formatDay={(locale, date) => moment(date).format('D')} // 일 제거 숫자만 보이게
        next2Label={null} // +1년 & +10년 이동 버튼 숨기기
        prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
        minDetail="year" // 10년 단위 년도 숨기기
        formatMonthYear={(locale, date) => moment(date).format('YYYY. MM')} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
        calendarType="gregory"
        tileClassName={tileClassName} // 타일 클래스 이름 설정
        view="month"
      />
    </div>
  );
};

export default WeekCalendar;
