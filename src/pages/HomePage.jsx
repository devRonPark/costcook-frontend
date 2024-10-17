import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RoundedButton from '../components/common/Button/RoundedButton';
import RoundedButtonHalfWidth from '../components/common/Button/RoundedButtonHalfWidth';
import Layout from '../components/layout/Layout';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Layout>
      <SettingContainer>
        <h3>추천 설정</h3>
        <MoneyContainerWrapper>
          <MoneyButton onClick={openModal}>예산</MoneyButton>
          <MoneyButton onClick={openModal}>끼니</MoneyButton>
        </MoneyContainerWrapper>
      </SettingContainer>
      <RecommendContainer>
        <RecommendListContainer>
          {/* 추천을 받기 전에는 버튼으로 출력되게 구현 */}
          <Link to="../Recommend">
            <Button>추천하기</Button>
          </Link>

          {/* 추천을 받은 후에는 리스트가 출력되게 구현 */}
          <RecommendList>
            <h3>추천 리스트</h3>
          </RecommendList>
          <RecommendList>
            <h3>추천 리스트</h3>
          </RecommendList>
          <RecommendList>
            <h3>추천 리스트</h3>
          </RecommendList>
        </RecommendListContainer>
      </RecommendContainer>
      <UpcommingReceiptContainer>
        <UpcommingReceiptHeader>
          <h3>인기레시피</h3>
          <RightText href="#">더보기</RightText>
        </UpcommingReceiptHeader>
        <UpcommingReceiptListContainer>
          <UpcommingReceiptList>
            <h2>리스트</h2>
          </UpcommingReceiptList>
          <UpcommingReceiptList>
            <h2>리스트</h2>
          </UpcommingReceiptList>
          <UpcommingReceiptList>
            <h2>리스트</h2>
          </UpcommingReceiptList>
        </UpcommingReceiptListContainer>
      </UpcommingReceiptContainer>
    </Layout>
  );
};

export default HomePage;

const SettingContainer = styled.div`
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  border: 1px black solid;
`;

const MoneyContainerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0;
  border: 1px black solid;
`;

const MoneyButton = styled.button`
  width: 45%;
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

const RecommendContainer = styled.div`
  flex: 1;
  width: 100%;
  border: 1px solid black;
  text-align: center;
  display: flex; // Flexbox를 사용
  flex-direction: column; // 세로 방향으로 정렬
  justify-content: center; // 세로 중앙 정렬
`;
const RecommendListContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
`;

const RecommendList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  border: 1px solid black;
  height: 220px;
  width: 120px;
  column-gap: 5px;
`;

const UpcommingReceiptContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UpcommingReceiptListContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
`;

const UpcommingReceiptList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  border: 1px solid black;
  height: 220px;
  width: 120px;
  column-gap: 5px;
`;

const RightText = styled.a`
  margin-right: 8px;
  font-size: 12px;
  text-align: right;
`;

const UpcommingReceiptHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
