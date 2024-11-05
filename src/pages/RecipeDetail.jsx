import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Layout from '../components/layout/Layout';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../components/StarRating';
import { formatPrice } from '../utils/formatData';
// import RecipeEvaluation from '../components/Input/RecipeEvaluation';
import { useInView } from 'react-intersection-observer';
import ImageDisplay from '../components/display/ImageDisplay';
import axios from 'axios';
import { useAuth } from '../context/Auth/AuthContext';
// 스타일 불러오기
import {
  ReceiptImage,
  ScoreContainer,
  ScoreSubContainer,
  IngredientContainer,
  IngredientDetailContainer,
  IngredientDetailUl,
  IngredientDetailLi,
  IngredientDetailText,
  IngredientDetailPrice,
  TabListContainer,
  TabList,
  TabContent,
  ReviewContainer,
  ReviewTextContainer,
  ReviewImage,
  TitleText,
  ContentText,
  StarText,
  HowToCooking,
} from '../styles/RecipeDetail';

const RecipeDetail = () => {
  // 접속중 유저 정보
  const { state } = useAuth();
  console.log('유저정보: ', state.user?.id);
  const [myReview, setMyReview] = useState(null); // 내가 작성한 리뷰

  const navigate = useNavigate();
  // 레시피 & 재료
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({}); // 전체 레시피 정보
  const [ingredientData, setIngredientData] = useState([]); // 재료 정보

  // 리뷰 목록
  const [reviewList, setReviewList] = useState([]); // 전체 리뷰 목록
  const [page, setPage] = useState(1); // 리뷰 페이지
  const [hasMore, setHasMore] = useState(true); // 추가 리뷰가 있는지 확인
  const { ref, inView } = useInView(); // 스크롤 감지용 useRef

  // 활성 탭 상태 관리(처음부터 열려있음)
  const [activeTabs, setActiveTabs] = useState([
    'ingredients',
    'cookingMethod',
    'recipeEvaluation',
    'review',
  ]); // 초기값은 전부다 열려있는 상태

  // 클릭 시 리뷰 목록으로 이동
  const scrollToReview = () => {
    if (!activeTabs.includes('review')) {
      setActiveTabs((prev) => [...prev, 'review']);
    }
    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reviewRef = useRef(null); // 리뷰 컨테이너의 ref 생성

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    ); // 탭을 토글
  };

  // 레시피 상세 정보 가져오기
  const getRecipeById = async () => {
    try {
      const res = await recipeAPI.getRecipeById(recipeId);
      // 레시피 데이터
      setRecipe(res.data);
      console.log('레시피 정보: ', res.data);
      console.log('레시피ID: ', res.data.recipeId);

      // 재료 데이터
      const ingredients = res.data.ingredients.map((item) => ({
        name: item.ingredientName,
        quantity: item.quantity,
        unit: item.unitName,
        price: Math.round(item.price * item.quantity), // 정수값만 출력
        categoryId: item.category.id,
        categoryName: item.category.name,
      }));
      setIngredientData(ingredients);
      console.log('재료 정보 : ', ingredients);
    } catch (error) {
      console.log('레시피를 불러올 수 없음', error);
    }
  };
  // 가져온 정보 보여주기
  useEffect(() => {
    getRecipeById();
  }, []);

  // 리뷰 관련 메소드
  // 이 레시피에 내가 작성한 리뷰 가져오기

  // DB의 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const res = await recipeAPI.getRecipeReviews(recipeId, page);
      console.log('리뷰 데이터 : ', res.data.reviews);
      if (res.data.reviews.length === 0) {
        setHasMore(false);
        return;
      }
      // 기존 리뷰에 새 리뷰 추가
      setReviewList((prevReviews) => [...prevReviews, ...res.data.reviews]);

      console.log('전체 데이터 : ', res.data);
    } catch (error) {
      console.error('리뷰 불러오기 오류', error);
    }
  };

  // 스크롤 시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  // 페이지 변경 시 마다 추가 리뷰 로드
  useEffect(() => {
    console.log('리뷰페이지 : ', page);
    fetchReviews();
  }, [page]);

  return (
    <Layout isBackBtnExist pageName={recipe.title} isRecipeDetailPage>
      <ReceiptImage>
        <ImageDisplay
          objectFit={'cover'}
          height={'100%'}
          width={'100%'}
          borderRadius={'0%'}
          altText={recipe.title}
          src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}
        ></ImageDisplay>
      </ReceiptImage>

      <ScoreContainer>
        <ScoreSubContainer text="center">
          <StarRating fontSize={'30px'} ratings={recipe.avgRatings} />
        </ScoreSubContainer>
        <ScoreSubContainer text="center">
          평점 {recipe.avgRatings}
        </ScoreSubContainer>
        {/* "리뷰보기" 버튼 클릭 시 스크롤 이동 */}
        <ScoreSubContainer
          style={{ cursor: 'pointer' }}
          text="center"
          onClick={scrollToReview}
        >
          리뷰보기
        </ScoreSubContainer>
      </ScoreContainer>
      <TabListContainer>
        <TabList onClick={() => handleTabClick('ingredients')}>
          {/* 탭 상태 관련 없이 항상 보여주기 */}
          레시피 재료 ({recipe.servings}인분){' '}
          {recipe.price ? formatPrice(recipe.price) : 0}원
          {activeTabs.includes('ingredients')}
          {activeTabs.includes('ingredients') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('ingredients') && (
          <TabContent>
            <IngredientContainer>
              {/* 왼쪽: 재료 */}
              <IngredientDetailContainer>
                <IngredientDetailUl>
                  {ingredientData
                    .filter((ingredient) => ingredient.categoryId !== 10)
                    .map((ingredient, index) => (
                      <IngredientDetailLi key={index}>
                        <IngredientDetailText>
                          {ingredient.name} {ingredient.quantity}
                          {ingredient.unit}
                        </IngredientDetailText>
                        {/* 가격정보 오른쪽정렬 */}
                        <IngredientDetailPrice style={{ textAlign: 'right' }}>
                          {formatPrice(ingredient.price)}원
                        </IngredientDetailPrice>
                      </IngredientDetailLi>
                    ))}
                </IngredientDetailUl>
              </IngredientDetailContainer>

              {/* 오른쪽: 양념(카테고리ID=10) */}
              <IngredientDetailContainer>
                <IngredientDetailUl>
                  {ingredientData
                    .filter((ingredient) => ingredient.categoryId === 10)
                    .map((ingredient, index) => (
                      <IngredientDetailLi key={index}>
                        <IngredientDetailText>
                          {ingredient.name} {ingredient.quantity}
                          {ingredient.unit}
                        </IngredientDetailText>
                        {/* 가격정보 오른쪽정렬 */}
                        <IngredientDetailPrice style={{ textAlign: 'right' }}>
                          {formatPrice(ingredient.price)}원
                        </IngredientDetailPrice>
                      </IngredientDetailLi>
                    ))}
                </IngredientDetailUl>
              </IngredientDetailContainer>
            </IngredientContainer>
          </TabContent>
        )}

        <TabList onClick={() => handleTabClick('cookingMethod')}>
          레시피 조리방법{' '}
          {activeTabs.includes('cookingMethod') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('cookingMethod') && (
          <TabContent>
            {recipe?.rcpSno && ( // 없는 경우 빈 객체 반환
              <ExternalContent rcpSno={recipe.rcpSno} />
            )}
          </TabContent>
        )}

        <TabList onClick={() => handleTabClick('recipeEvaluation')}>
          레시피 평가하기{' '}
          {activeTabs.includes('recipeEvaluation') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('recipeEvaluation') && (
          // 레시피 평가 컴포넌트 가져오기
          <TabContent>
            {/* <RecipeEvaluation
              // setRecipeList={setRecipeList} // 리뷰 목록 상태 제어 함수
              recipeId={recipeId} // 레시피ID
              isLoggedIn={state.isAuthenticated}
            /> */}
            <p>레시피를 평가해주세요.</p>
          </TabContent>
        )}

        <TabList onClick={() => handleTabClick('review')}>
          레시피 리뷰{' '}
          {activeTabs.includes('review') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {/* 리뷰 컨텐츠에 ref 연결  */}
        {activeTabs.includes('review') && (
          <TabContent ref={reviewRef}>
            {state.user?.id != null ? (
              <p>내가 작성한 리뷰 영역 </p>
            ) : (
              <p>유저 정보 없음</p>
            )}

            {reviewList.map((review) => (
              <ReviewContainer key={review.id} review={review}>
                <ReviewImage>
                  <img src="" alt="리뷰이미지" />
                </ReviewImage>
                <ReviewTextContainer>
                  <span>{review.updatedAt}</span>

                  <TitleText>{review.user.nickname}</TitleText>
                  <StarText>{'★'.repeat(review.score)}</StarText>
                  <ContentText>{review.comment}</ContentText>
                </ReviewTextContainer>
              </ReviewContainer>
            ))}
            {/* 마지막 리뷰 다음에 스크롤 감지용 빈 div */}
            {/* {reviewList.length < reviewsData.length && <div ref={ref} style={{ height: '1px' }} />} */}
            {hasMore && <p ref={ref}>.</p>}
          </TabContent>
        )}
      </TabListContainer>
    </Layout>
  );
};

export default RecipeDetail;

// 만개의 레시피 조리방법 가져오기
const ExternalContent = ({ rcpSno }) => {
  const [content, setContent] = useState('');

  const getExternalContent = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_REST_SERVER}/recipes/test?number=${rcpSno}`
    );
    // console.log("만개의레시피 크롤링 : ", res.data);
    setContent(res.data);
  };

  useEffect(() => {
    getExternalContent();
  }, []);

  return <HowToCooking dangerouslySetInnerHTML={{ __html: content }} />;
};
