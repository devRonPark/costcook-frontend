// import { formatDistanceToNow } from 'date-fns'; // date-fns 라이브러리 사용
// import ko from 'date-fns/locale/ko'; // 한국어 로케일

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
  const intNum = Math.round(num);
  return intNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCreationDate = (date) => {
  const now = new Date();
  const createdDate = new Date(date);

  const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // 오늘 작성된 경우
    return `방금`;
  } else if (diffDays < 7) {
    // 7일 이내 작성된 경우
    return `${diffDays}일 전`;
  } else if (diffDays < 30) {
    // 30일 이내 작성된 경우
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  } else {
    // 30일 이상 작성된 경우
    return createdDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
};
