// 별점 입력 시 별 아이콘으로 반영되는 코드
//  ★☆☆☆☆
import React from 'react';

export const StarRating = ({ ratings }) => {
  let stars = [];
  // 4.5 이상이면 별 5개
  if (ratings >= 4.5) {
    stars = ['★', '★', '★', '★', '★'];
    // 4.5 미만이면 별 개수 = 소수점 버림
  } else {
    const intStars = Math.floor(ratings);
    stars = [
      ...Array.from({ length: intStars }, () => '★'), // 별 채우기
      ...Array.from({ length: 5 - intStars }, () => '☆'), // 빈 별
    ];
  }
  return <span>{stars.join('')}</span>; // 배열을 문자열로 결합
};
