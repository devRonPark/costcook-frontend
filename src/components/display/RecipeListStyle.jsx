// 레시피 목록 스타일 컴포넌트 (RecipePage, HomePage)

import styled from 'styled-components';
import { Button } from '@mui/material';
import { StyledScrollbar } from '../display/ScrollbarStyle';

// RecipePage.jsx

// 정렬 버튼 영역
export const FilterListContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

// 레시피 하나 영역
export const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  height: 200px; // 220px에서 줄임
  width: 150px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
`;

// 레시피 이미지 영역
export const RecipeImageBox = styled.div`
  height: 130px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// 레시피 이미지
export const RecipeImage = styled.img`
  width: 100%;
  height: 102%;
  object-fit: cover;
  border-radius: 10px 10px 0px 0px;
`;

// 레시피 이름
export const TitleText = styled.h3`
  font-family: 'GumiRomanceTTF'; // 낭만있구미체
  font-size: 16px;
  opacity: 0.8;
  padding: 2px;
  font-weight: 100;
  margin: 3px 0;
  text-align: center;
  white-space: nowrap; // 한줄 고정
  overflow: hidden; // 넘치면 숨김
  text-overflow: ellipsis; // 넘친 부분 ... 표시
  width: 100%;
`;

// 가격
export const PriceText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 11px;
  margin: 3px 0;
`;

// 평점
export const StarText = styled.p`
  font-family: 'BMJUA'; // 배민 주아체
  font-size: 12px;
  margin: 3px 0;
`;

// Hompage.jsx
export const SettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MoneyContainerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0;
`;
export const RowTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const MoneyButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: left;
  border: 1px solid black;
  background-color: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  padding: 16px;
  box-shadow: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RecommendContainer = styled.div`
  flex: 1;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const UpcommingReceiptContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const UpcommingReceiptHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ListContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;
`;

export const RightText = styled(Button)`
  font-family: 'BMJUA' !important;
  color: black !important;
  margin-right: 8px;
  font-size: 14px;
  text-align: right;
`;

export const ReceiptImage = styled.div`
  height: 120px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px 5px;
  text-align: left;
`;
