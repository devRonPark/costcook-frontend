import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Modal, Slider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { budgetAPI } from '../services/budget.api';
import AuthApi from '../services/auth.api';

// 년도 계산하는 부분
const getCurrentYearAndWeek = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMilliseconds = date - startOfYear;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const currentWeek = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);

  return { year: date.getFullYear(), week: currentWeek };
};

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budget, setBudget] = useState(0); // 기본값 설정
  const [userId, setUserId] = useState(null); // 사용자 ID 상태 추가

  const navigate = useNavigate();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleBudgetChange = (event, newValue) => {
    setBudget(newValue);
  };

  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);

  const [isDefaultBudget, setIsDefaultBudget] = useState(false);

  // 예산 가져오기
  const fetchWeeklyBudget = async () => {
    try {
      const response = await budgetAPI.getWeeklyBudget(year, week);
      if (response.data.message === '기본값 설정') {
        setIsDefaultBudget(true);
      }
      setBudget(response.data.budget);
    } catch (error) {
      console.error('예산을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setYear(year);
    setWeek(week);

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await AuthApi.getMyInfo();
        setUserId(response.data.id); // 사용자 ID 설정
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchUserInfo();
    fetchWeeklyBudget();
  }, []);

  // DB에 사용자가 설정한 예산 등록
  const setWeeklyBudget = async () => {
    const budgetRequest = {
      year,
      weekNumber: week,
      user_id: userId,
      weeklyBudget: budget,
    };

    try {
      if (isDefaultBudget) {
        const res = await budgetAPI.createWeeklyBudget(budgetRequest); // 생성 API 호출
        if (res.status === 201) setIsDefaultBudget(false);
      } else {
        const res = await budgetAPI.modifyWeeklyBudget(budgetRequest); // 수정 API 호출
      }
    } catch (error) {
      console.error(error);
    }
    closeModal();
  };

  // 추천받기 버튼 클릭 시 예산 설정
  const checkIsDefaultBudget = async () => {
    if (isDefaultBudget) {
      openModal(); // 예산 설정 모달 열기
    } else {
      navigate('/Recommend');
    }
  };

  return (
    <Layout isSearchBtnExist>
      <SettingContainer>
        <h3>추천 설정</h3>
        <MoneyContainerWrapper>
          <MoneyButton onClick={openModal}>
            예산 : {budget.toLocaleString()}원
          </MoneyButton>
        </MoneyContainerWrapper>
      </SettingContainer>
      <RecommendContainer>
        <ListContainer>
          <List>
            <ReceiptImage>
              <Button
                onClick={() => {
                  checkIsDefaultBudget();
                }}
              >
                추천받기
              </Button>
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

      {/* 예산 설정 모달 */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContainer>
          <h3>예산 설정</h3>
          <Slider
            value={budget}
            onChange={handleBudgetChange}
            min={0}
            max={100000}
            step={1000}
            valueLabelDisplay="auto"
          />
          <p>선택된 예산: {budget.toLocaleString()}원</p>
          <Button onClick={() => setWeeklyBudget()}>확인</Button>
        </ModalContainer>
      </Modal>
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

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  border: 2px solid #000;
  padding: 16px;
  box-shadow: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
