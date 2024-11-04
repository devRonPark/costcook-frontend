import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Modal, Slider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { budgetAPI } from '../services/budget.api';
import AuthApi from '../services/auth.api';
import { useAuth } from '../context/Auth/AuthContext';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../components/StarRating';
import { ORDER, SORT } from '../utils/sort';

import { formatPrice } from '../utils/formatData';
import {
  SettingContainer,
  MoneyContainerWrapper,
  MoneyButton,
  ModalContainer,
  RecommendContainer,
  UpcommingReceiptContainer,
  UpcommingReceiptHeader,
  ListContainer,
  List,
  RightText,
  RecipeImage,
  RecipeImageBox,
  TextBox,
  TitleText,
  PriceText,
  StarText,
  ListRowContainer,
} from '../components/display/RecipeListStyle';

// 년도 계산하는 부분
const getCurrentYearAndWeek = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMilliseconds = date - startOfYear;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const currentWeek = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);

  return { year: date.getFullYear(), week: currentWeek };
};

const HomePage = () => {
  const { state } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budget, setBudget] = useState(0); // 기본값 설정
  const [userId, setUserId] = useState(null); // 사용자 ID 상태 추가
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [size, setSize] = useState(3); // 3개만 보여주기

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
        console.log(response.data.id);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchUserInfo();
    fetchWeeklyBudget();

    // if (state.isAuthenticated) {
    //   // 회원
    //   fetchWeeklyBudget();
    // } else {
    //   // 비회원
    //   if (sessionStorage.getItem("budget"))
    //   setBudget(sessionStorage.getItem("budget"));
    //   setIsDefaultBudget(true);
    // }
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
      navigate('/Recommend', { state: { budget, year, week, userId } });
    }
  };

  // 인기레시피 데이터 가져오기(조회수 높은 정렬)
  const fetchData = async () => {
    try {
      const res = await recipeAPI.getMoreRecipeList(3);
      if (res.data.recipes.length === 0) {
        console.log('레시피가 존재하지 않습니다.');
        return;
      }
      setRecipeList(res.data.recipes);
      console.log('홈페이지 인기레시피 : ', res.data.recipes);
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };

  useEffect(() => {
    fetchData(size);
  }, [size]);

  // 더보기 -> 레시피 목록 이동(조회수 높은순 정렬)
  const handleMoreClick = async () => {
    try {
      setSize(9);
      const res = await recipeAPI.getMoreRecipeList(9);
      navigate('/recipe', {
        state: { sort: 'viewCountDesc' },
      });
    } catch (error) {
      console.error('더보기 API 호출 중 오류 발생:', error);
    }
  };

  return (
    <Layout isSearchBtnExist pageName="Cost Cook">
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
            {/* 로직 구현 시 실제 이미지 넣기 */}
            {/* 로직 구현 시 실제 데이터 넣기 */}
            <RecipeImageBox>
              <Button
                onClick={() => {
                  checkIsDefaultBudget();
                }}
              >
                추천받기
              </Button>
            </RecipeImageBox>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>

          <List>
            <RecipeImageBox>이미지</RecipeImageBox>
            <TextBox>
              <TitleText>김치볶음밥</TitleText>
              <PriceText>4300원</PriceText>
              <StarText>★★★★☆ 4.0</StarText>
            </TextBox>
          </List>
          <List>
            <RecipeImageBox>이미지</RecipeImageBox>
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
          <RightText onClick={handleMoreClick}>더보기</RightText>
        </UpcommingReceiptHeader>
        <ListContainer>
          <ListRowContainer>
            {recipeList.map((recipe) => (
              <List key={recipe.id}>
                <Link to={`/recipeDetail/${recipe.id}`}>
                  <RecipeImageBox>
                    <RecipeImage
                      alt={recipe.title}
                      src={`${import.meta.env.VITE_SERVER}${
                        recipe.thumbnailUrl
                      }`}
                    />
                  </RecipeImageBox>
                </Link>
                <TitleText>{recipe.title}</TitleText>
                <PriceText>
                  {formatPrice(recipe.price / recipe.servings)}원 (1인분)
                </PriceText>
                <StarText>
                  <StarRating ratings={recipe.avgRatings} /> (
                  {recipe.avgRatings})
                </StarText>
              </List>
            ))}
          </ListRowContainer>
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
