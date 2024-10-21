import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Layout isSearchBtnExist>
      <SettingContainer>
        <h3>추천 설정</h3>
        <MoneyContainerWrapper>
          <MoneyButton onClick={openModal}>예산</MoneyButton>
          <MoneyButton onClick={openModal}>끼니</MoneyButton>
        </MoneyContainerWrapper>
      </SettingContainer>
      <RecommendContainer>
        <ListContainer>
          <List>
            <ReceiptImage>
              <Link to="../Recommend">
                <Button>추천하기</Button>
              </Link>
            </ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>

          <List>
            <ReceiptImage>이미지</ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
          <List>
            <ReceiptImage>이미지</ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
        </ListContainer>
      </RecommendContainer>
      <UpcommingReceiptContainer>
        <UpcommingReceiptHeader>
          <h3>인기레시피</h3>
          <RightText href="#">더보기</RightText>
        </UpcommingReceiptHeader>
        <ListContainer>
          <List>
            <ReceiptImage>이미지</ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
          <List>
            <ReceiptImage>이미지</ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
          <List>
            <ReceiptImage>이미지</ReceiptImage>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
        </ListContainer>
      </UpcommingReceiptContainer>
    </Layout>
  );
};

export default HomePage;

const SettingContainer = styled.div`
  width: 100%;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UpcommingReceiptContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UpcommingReceiptHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  border: 1px solid black;
  height: 220px;
  width: 120px;
`;

const RightText = styled.a`
  margin-right: 8px;
  font-size: 12px;
  text-align: right;
`;

const ReceiptImage = styled.div`
  height: 120px;
  width: 120px;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px 5px;
  text-align: left;
`;

const TitleText = styled.h3`
  margin: 3px 0;
`;

const PriceText = styled.a`
  margin: 3px 0;
`;

const StarText = styled.a`
  margin: 3px 0;
`;
