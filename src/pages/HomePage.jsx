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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  SettingContainer,
  MoneyContainerWrapper,
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
import StartButton from '../components/common/Button/StartButton';
import styled from 'styled-components';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budget, setBudget] = useState(10000); // 기본값 설정
  const [userId, setUserId] = useState(
    state?.isAuthenticated ? state.user.id : null
  ); // 사용자 ID 상태 추가
  const [recipeList, setRecipeList] = useState([]); // DB 레시피 불러오기
  const [size, setSize] = useState(3); // 3개만 보여주기
  const [recipes, setRecipes] = useState([]);
  const [totalPricePerServing, setTotalPricePerServing] = useState(0); // 총 합계를 저장할 상태 변수
  const [usedTotalPrice, setUsedTotalPrice] = useState(0); // 총 사용한 합계를 저장할 상태 변수
  const navigate = useNavigate();
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  const [isDefaultBudget, setIsDefaultBudget] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [autoIncrementing, setAutoIncrementing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const recommendedPercentage = (totalPricePerServing / budget) * 100;
  const usedPercentage = (usedTotalPrice / budget) * 100;
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

          const totalPrice = parsedData.recipes.reduce((sum, recipe) => {
            return sum + recipe.price / recipe.servings;
          }, 0);
          setTotalPricePerServing(totalPrice);

          // used 값이 1인 레시피의 가격 합 계산
          const usedRecipesTotalPrice = parsedData.recipes
            .filter((recipe) => recipe.used == 1)
            .reduce((sum, recipe) => {
              return sum + recipe.price / recipe.servings;
            }, 0);

          // 필요한 경우 상태에 저장
          setUsedTotalPrice(usedRecipesTotalPrice);
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

      const usedRecipesTotalPrice = response.data.recipes
        .filter((recipe) => recipe.used == 1)
        .reduce((sum, recipe) => {
          return sum + recipe.price / recipe.servings;
        }, 0);

      setUsedTotalPrice(usedRecipesTotalPrice);
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
        <MoneyContainerWrapper>
          {recipes.length === 0 ? (
            <WidthDiv>
              <BudgetContainer>
                <BudgetLabel>
                  설정 예산: {budget.toLocaleString()}원
                </BudgetLabel>
                <Slider
                  value={budget}
                  onChange={handleBudgetChange}
                  onChangeCommitted={setWeeklyBudget}
                  min={10000}
                  max={100000}
                  step={1000}
                />
              </BudgetContainer>
              <ExplainText style={{ textAlign: 'center' }}>
                ▲ 1. 예산을 설정하세요 (최소 : 10,000 원 / 최대 : 100,000 원)
              </ExplainText>
            </WidthDiv>
          ) : (
            <WidthFlexRowDiv>
              <RowTextContainer>
                <ProgressBarContainer>
                  <RecommendedBudgetBar
                    recommendedPercentage={recommendedPercentage}
                  />
                  <UsedBudgetBar usedPercentage={usedPercentage} />
                </ProgressBarContainer>

                <BudgetDescriptionContainer>
                  <BudgetDescription>
                    <ColorBox color="#ff6b6b" />
                    <span>사용한 예산</span>
                  </BudgetDescription>
                  <BudgetDescription>
                    <ColorBox color="#ffa999" />
                    <span>추천받은 예산</span>
                  </BudgetDescription>
                  <BudgetDescription>
                    <ColorBox color="#e0e0e0" />
                    <span>전체 예산</span>
                  </BudgetDescription>
                </BudgetDescriptionContainer>
              </RowTextContainer>
              <Button
                onClick={() => {
                  setStatus(2);
                  checkIsDefaultBudget();
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#ff6b6b  ',
                }}
              >
                <AddCircleOutlineIcon fontSize="large" /> 추가 추천
              </Button>
            </WidthFlexRowDiv>
          )}
        </MoneyContainerWrapper>
      </SettingContainer>
      <RecommendContainer>
        <ListContainer>
          {recipes.length === 0 ? (
            <WidthDiv>
              <StartButton onClick={checkIsDefaultBudget}>추천받기</StartButton>
              <ExplainText>▲ 2. 추천받기 버튼을 클릭하세요</ExplainText>
            </WidthDiv>
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
    </Layout>
  );
};

export default HomePage;

const WidthDiv = styled.div`
  width: 100%;
`;
const WidthFlexRowDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ExplainText = styled.p`
  font-family: 'GmarketSansMedium';
  font-size: 15px;
  margin: 3px 0;
`;

const BudgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const BudgetLabel = styled.div`
  font-family: 'GmarketSansMedium';
  font-size: 18px;
  margin-bottom: 20px;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  height: 24px;
  width: 100%;
  background-color: #e0e0e0; /* 전체 예산 바 색상 */
  border-radius: 12px;
  overflow: hidden;
`;

const RecommendedBudgetBar = styled.div`
  position: absolute;
  height: 100%;
  width: ${(props) => props.recommendedPercentage}%;
  background-color: #ffa999; /* 추천받은 예산 색상 */
`;

const UsedBudgetBar = styled.div`
  position: absolute;
  height: 100%;
  width: ${(props) => props.usedPercentage}%;
  background-color: #ff6b6b; /* 사용한 예산 색상 */
`;

// 예산 설명 컨테이너 스타일 정의
const BudgetDescriptionContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  margin-top: 10px;
`;

const BudgetDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
  border-radius: 3px;
`;
