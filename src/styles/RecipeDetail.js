// 레시피 상세 페이지 스타일
import React from 'react';
import styled from 'styled-components';

export const ReceiptImage = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 점수
export const ScoreContainer = styled.div`
  height: 50px;
  width: 100%;
  font-family: 'RixXladywatermelonR';
  font-size: 24px;
  margin: 20px 0px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const ScoreSubContainer = styled.div`
  height: 50px;
  width: 30%;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: ${(props) =>
    props.text || 'flex-start'}; /* 기본값은 'flex-start'로 설정 */
`;

// 재료
export const IngredientContainer = styled.div`
  display: block;
  width: 100%;
`;

export const IngredientDetailContainer = styled.div`
  width: 50%;
  display: inline-block;
  padding: 10px;
  vertical-align: top;
`;

export const IngredientDetailUl = styled.ul`
  list-style-type: none;
  padding: 2px;
`;

export const IngredientDetailLi = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IngredientDetailText = styled.p`
  font-family: 'GangwonEdu_OTFBoldA';
`;

export const IngredientDetailPrice = styled.p`
  font-family: 'GangwonEdu_OTFBoldA';
`;

export const TabListContainer = styled.div`
  width: 100%;
`;

export const TabList = styled.div`
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-family: 'GangwonEduPowerExtraBoldA';
  display: flex;
  flex-direction: row;
  box-shadow: 0 -0.4px 0px 0px gray;
  padding-top: 5px;
  justify-content: space-between;
  align-items: center; /* 아이콘과 텍스트 세로 중앙 정렬 */
  cursor: pointer; /* 클릭 가능하게 변경 */
  padding-left: 10px;
`;

export const TabContent = styled.div`
  width: 100%;
  min-height: 150px;
  margin: 10px 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

// 리뷰 관련 스타일
export const ReviewContainer = styled.div`
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin-top: 10px;
`;

export const ReviewTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReviewImage = styled.div`
  height: 100px;
  width: 100px;
  border-right: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleText = styled.h3`
  margin: 3px 0 0 0;
`;

export const ContentText = styled.p`
  margin: 3px 0;
`;

export const StarText = styled.p`
  font-size: 13px;
`;

export const HowToCooking = styled.div`
  list-style: none;

  li {
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    justify-content: space-between;
  }

  .step_list_num {
    flex: 0 0 10%;
    font-weight: bold;
  }

  .step_list_txt_cont {
    line-height: 1.5;
    font-family: 'STUNNING-Bd';
    flex: 0 0 60%;
    font-size: 14px;
  }

  .step_list_txt_pic {
    margin-left: auto;
    flex: 0 0 30%;
    display: flex;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 5px;
  }
`;
