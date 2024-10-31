// 평점 0 ~ 5 분기처리 ★☆☆☆☆ : 우선 (int) avgRatings 값에 따라 표기(소수점 버림)
export const renderStars = (ratings) => {
  const intStars = Math.floor(ratings); // 소수점 버림
  const stars = [
    ...Array.from({ length: intStars }, () => '★'), // 별 채우기
    ...Array.from({ length: 5 - intStars }, () => '☆'), // 빈 별
  ];
  return stars.join(''); // 배열을 문자열로 결합
};

/**
 * 숫자를 천 단위로 구분하여 문자열로 변환하는 함수
 * @param {number} num - 변환할 숫자
 * @returns {string} - 천 단위로 구분된 문자열
 */
export const formatNumberWithCommas = (num) => {
  if (typeof num !== 'number') {
    throw new Error('입력값은 숫자여야 합니다.');
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
