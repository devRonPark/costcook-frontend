import React, { useEffect, useState } from 'react';
import { Button, Modal, Slider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { budgetAPI } from '../services/budget.api';
import AuthApi from '../services/auth.api';
import { useAuth } from '../context/Auth/AuthContext';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../components/StarRating';
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
  RowTextContainer,
  TitleText,
  PriceText,
  StarText,
  ListRowContainer,
} from '../components/display/RecipeListStyle';
import { recommendAPI } from '../services/recommend.api';
import Carousel from '../components/common/Carousel/MainPageCarousel';

// 년도 계산하는 부분
const getCurrentYearAndWeek = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMilliseconds = date - startOfYear;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const currentWeek = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);

  return { year: date.getFullYear(), week: currentWeek };
};

const HomePage = () => {
  const [status, setStatus] = useState(1); // 기본값을 1로 설정 (첫 번째 추천)
  const { state } = useAuth();
  console.log(state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budget, setBudget] = useState(10000); // 기본값 설정
  const [userId, setUserId] = useState(
    state?.isAuthenticated ? state.user.id : null
  ); // 사용자 ID 상태 추가
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [size, setSize] = useState(3); // 3개만 보여주기
  const [recipes, setRecipes] = useState([]);
  const [totalPricePerServing, setTotalPricePerServing] = useState(0); // 총 합계를 저장할 상태 변수
  const navigate = useNavigate();
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  const [isDefaultBudget, setIsDefaultBudget] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [autoIncrementing, setAutoIncrementing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const handleBudgetChange = (event, newValue) => {
    setBudget(newValue);
  };

  // 예산 가져오기
  const fetchWeeklyBudget = async () => {
    try {
      // 비회원
      if (!state?.isAuthenticated) {
        const storedBudget = sessionStorage.getItem('budget');
        if (storedBudget) {
          const parsedBudget = JSON.parse(storedBudget);
          setBudget(parsedBudget.amount); // amount 필드를 사용하여 예산 설정
        } else {
          setBudget(10000); // 기본값 설정
        }
        return;
      }

      // 회원
      else {
        const response = await budgetAPI.getWeeklyBudget(year, week);
        if (response.data.message === '기본값 설정') {
          setIsDefaultBudget(true);
        }
        setBudget(response.data.budget || 10000);
      }
    } catch (error) {
      console.error('예산을 가져오는 중 오류 발생:', error);
    }
  };

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await AuthApi.getMyInfo();
      setUserId(response.data.id); // 사용자 ID 설정
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setYear(year);
    setWeek(week);

    // 회원 인 경우
    if (state?.isAuthenticated) {
      fetchUserInfo();
    }

    fetchWeeklyBudget();
    getRecommendedRecipes();
  }, [state]);

  // 추천 받은 레시피 가져오기

  const getRecommendedRecipes = async () => {
    try {
      // 비회원 인 경우
      if (!state?.isAuthenticated) {
        const storedData = sessionStorage.getItem('recommendedRecipeList');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // year와 week 값이 일치하는지 확인
          if (parsedData.year === year && parsedData.week === week) {
            setRecipes(parsedData.recipes);
          }
        }
        return;
      }

      // 회원 인 경우
      else {
      }
      const response = await recommendAPI.getRecommendedRecipes(year, week);
      setRecipes(response.data.recipes);

      const totalPrice = response.data.recipes.reduce((sum, recipe) => {
        return sum + recipe.price / recipe.servings;
      }, 0);

      setTotalPricePerServing(totalPrice);
    } catch (error) {
      console.error('추천 레시피를 불러오는 중 오류 발생:', error);
    }
  };

  // DB에 사용자가 설정한 예산 등록
  const setWeeklyBudget = async () => {
    const budgetRequest = {
      year,
      weekNumber: week,
      user_id: userId,
      weeklyBudget: budget,
    };

    try {
      // 비회원 인 경우
      if (!state?.isAuthenticated) {
        const budgetData = {
          year: year,
          weekNumber: week,
          amount: budget,
        };
        console.log(budgetData);
        sessionStorage.setItem('budget', JSON.stringify(budgetData));
        closeModal();
        return;
      }

      // 회원 인 경우
      else {
        if (isDefaultBudget) {
          const res = await budgetAPI.createWeeklyBudget(budgetRequest); // 생성 API 호출
          if (res.status === 201) setIsDefaultBudget(false);
        } else {
          const res = await budgetAPI.modifyWeeklyBudget(budgetRequest); // 수정 API 호출
        }
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
      navigate('/recipes/recommend', { state: { budget, year, week, userId } });
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
    } catch (error) {
      console.error('페이지를 찾을 수 없습니다.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 더보기 -> 레시피 목록 이동(조회수 높은순 정렬)
  const handleMoreClick = async () => {
    try {
      navigate('/recipes', {
        state: { more: 'viewCountDesc' },
      });
    } catch (error) {
      console.error('더보기 API 호출 중 오류 발생:', error);
    }
  };

  return (
    <Layout isSearchBtnExist pageName="Cost Cook">
      <SettingContainer>
        <h2>추천 설정</h2>
        <MoneyContainerWrapper>
          {recipes.length === 0 ? (
            <MoneyButton onClick={openModal}>
              예산 : {budget.toLocaleString()}원
            </MoneyButton>
          ) : (
            <RowTextContainer>
              <h4>
                이번주 설정 예산 :{' '}
                {/* {Math.floor(totalPricePerServing).toLocaleString()} /{' '} */}
                {budget.toLocaleString()}원
              </h4>
              <Button
                onClick={() => {
                  setStatus(2);
                  checkIsDefaultBudget();
                }}
              >
                다시 추천받기
              </Button>
            </RowTextContainer>
          )}
        </MoneyContainerWrapper>
      </SettingContainer>
      <RecommendContainer>
        <ListContainer>
          {recipes.length === 0 ? (
            <Button onClick={checkIsDefaultBudget}>추천받기</Button>
          ) : (
            <Carousel recipes={recipes} year={year} week={week} />
          )}
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
                <Link to={`/recipes/${recipe.id}`}>
                  <RecipeImageBox>
                    <RecipeImage
                      alt={recipe.title}
                      src={`${import.meta.env.VITE_BASE_SERVER_URL}${
                        recipe.thumbnailUrl
                      }`}
                    />
                  </RecipeImageBox>
                </Link>
                <TitleText>{recipe.title}</TitleText>
                <PriceText>{formatPrice(recipe.price)}원 (1인분)</PriceText>
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
