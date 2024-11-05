// 날짜 계산 컴포넌트

// 연 단위 주차 계산( 예: 45차 )
export const getCurrentYearAndWeek = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMilliseconds = date - startOfYear;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const currentWeek = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);
  return { year: date.getFullYear(), week: currentWeek };
};

// 캘린더 날짜 계산
export const getWeekAndFirstSundayDate = (date) => {
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

  return {
    week: weekOffset + 1,
    firstSundayDate: sundayDate,
  };
};
