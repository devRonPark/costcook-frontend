import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Layout from '../components/layout/Layout';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../components/StarRating';
import { formatPrice } from '../utils/formatData';
import RecipeEvaluation from '../components/RecipeEvaluation';
import { useInView } from 'react-intersection-observer';
import ImageDisplay from '../components/display/ImageDisplay';
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
} from '../styles/RecipeDetail';
import ShareModal from '../components/modal/ShareModal';
import RecipeInstructions from '../components/RecipeInstructions';
import ReviewEditModal from '../components/ReviewEditModal';
import { Star, StarOutline } from '@mui/icons-material';
import LoginModal from '../components/common/LoginModal';
import ReviewApi from '../services/review.api';
import { toast } from 'react-toastify';
import UserApi from '../services/user.api';
import RecipeReviewCard from '../components/RecipeReviewCard';

const RecipeDetail = () => {
  // 접속중 유저 정보
  const { state } = useAuth();
  const [isMyReviewExist, setIsMyReviewExist] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // 공유하기 모달 창 상태 제어

  const navigate = useNavigate();
  // 레시피 & 재료
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({}); // 전체 레시피 정보
  const [ingredientData, setIngredientData] = useState([]); // 재료 정보

  // 리뷰 관련 state
  const [isReviewEditMode, setIsReviewEditMode] = useState(false);
  const [reviewList, setReviewList] = useState([]); // 전체 리뷰 목록
  const [reviewState, setReviewState] = useState({ score: 0, comment: '' }); // 모달 내 변경되는 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [page, setPage] = useState(1); // 리뷰 페이지
  const [hasMore, setHasMore] = useState(true); // 추가 리뷰가 있는지 확인
  const { ref, inView } = useInView(); // 스크롤 감지용 useRef
  const reviewRef = useRef(null); // 리뷰 컨테이너의 ref 생성

  // 로그인 유도 창 관련 state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 활성 탭 상태 관리(처음부터 열려있음)
  const [activeTabs, setActiveTabs] = useState([
    'ingredients',
    'cookingMethod',
    'recipeEvaluation',
    'review',
  ]); // 초기값은 전부다 열려있는 상태

  // 레시피 로드 상태
  const [isRecipeLoaded, setIsRecipeLoaded] = useState(false);

  // 공유하기 모달창 열기 및 닫기 함수
  const handleShareModalOpen = () => setIsShareModalOpen(true);
  const handleShareModalClose = () => setIsShareModalOpen(false);

  // 클릭 시 리뷰 목록으로 이동
  const scrollToReview = () => {
    if (!activeTabs.includes('review')) {
      setActiveTabs((prev) => [...prev, 'review']);
    }

    reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    ); // 탭을 토글
  };

  useEffect(() => {
    // 로그인 후 대기 중인 리뷰 정보 확인
    const pendingReview = JSON.parse(sessionStorage.getItem('pendingReview'));

    if (pendingReview && pendingReview.isReviewing && isRecipeLoaded) {
      // 세션 스토리지에서 대기 중인 리뷰 정보를 제거
      sessionStorage.removeItem('pendingReview');
      // 리뷰 작성 위치로 스크롤
      scrollToReview();
      // 리뷰 모달 열기
      setIsReviewModalOpen(true);
    }
  }, [isRecipeLoaded, navigate, activeTabs]);

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
      setIsRecipeLoaded(true); // 레시피가 로드되었음을 설정
    } catch (error) {
      console.log('레시피를 불러올 수 없음', error);
    }
  };
  // 가져온 정보 보여주기
  useEffect(() => {
    getRecipeById();
  }, [recipeId]);

  // 로그인 모달창 관련 메소드
  const handleLoginModalOpen = () => setIsLoginModalOpen(true);
  const handleLoginModalClose = () => setIsLoginModalOpen(false);
  // 로그인 모달창 > 로그인 클릭 시 동작
  const handleLoginConfirm = () => {
    // 로그인 전 리뷰 작성 중이었다는 걸 기억.
    sessionStorage.setItem(
      'pendingReview',
      JSON.stringify({ isReviewing: true, recipeId })
    );
    navigate('/login');
  };

  // 리뷰 관련 메소드
  // 리뷰 작성 모달 내 인풋 변경 시
  const resetReview = () => setReviewState({ score: 0, comment: '' });
  const handleReviewModalOpen = () => {
    setIsReviewModalOpen(true);
  };
  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    resetReview();
  };
  const handleReviewChange = (field, value) => {
    setReviewState((prevState) => ({ ...prevState, [field]: value }));
  };
  // 별점 클릭 > 로그인 여부에 따라 동작이 달라짐.
  // 비로그인 상태 > 로그인 모달창 띄워서 로그인 유도.
  // 로그인 상태 > 리뷰 작성창 띄워서 리뷰 작성 유도.
  const handleStarClick = (index) => {
    const newScore = reviewState.score === index + 1 ? 0 : index + 1;

    if (!state.isAuthenticated) {
      // 로그인 모달 띄우기
      handleLoginModalOpen();
    } else {
      if (isMyReviewExist) {
        toast.info('이 레시피에 대한 리뷰는 이미 작성하셨습니다.');
        return;
      }
      handleReviewModalOpen();
      handleReviewChange('score', newScore);
    }
  };

  const createReview = async () => {
    try {
      const form = {
        recipeId: parseInt(recipeId),
        ...reviewState,
      };
      console.log(form);
      const res = await ReviewApi.createReview(form);
      if (res.status === 201) {
        console.log(res.data);
        toast.success('리뷰가 성공적으로 등록되었습니다!'); // 성공 메시지
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message // 서버에서 반환된 메시지 사용
          : '리뷰 등록에 실패했습니다. 다시 시도해 주세요.'; // 기본 메시지

      toast.error(errorMessage); // 에러 메시지 표시
    }
  };
  // 리뷰 등록, 수정에서 범용적으로 사용됨.
  const handleReviewSubmit = () => {
    // 리뷰 등록
    if (!isReviewEditMode) {
      createReview();
      resetReview();
    }
  };
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

  useEffect(() => {
    const fetchMyReview = async () => {
      try {
        const res = await UserApi.getMyReviewWithRecipeId(recipeId);
        console.log(res.data);
        setIsMyReviewExist(!!res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (state.isAuthenticated && state.user != null) {
      fetchMyReview();
    }
  }, [recipeId, state]);

  // 스크롤 시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  // 페이지 변경 시 마다 추가 리뷰 로드
  useEffect(() => {
    fetchReviews();
  }, [page]);

  return (
    <Layout
      isBackBtnExist
      pageName={recipe.title}
      isRecipeDetailPage
      onShareClick={handleShareModalOpen}
    >
      <ReceiptImage>
        <ImageDisplay
          objectFit={'cover'}
          height={'100%'}
          width={'100%'}
          borderRadius={'0%'}
          altText={recipe.title}
          src={`${import.meta.env.VITE_BASE_SERVER_URL}${recipe.thumbnailUrl}`}
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
              <RecipeInstructions rcpSno={recipe.rcpSno} />
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
          <TabContent>
            <RecipeEvaluation
              isMyReviewExist={isMyReviewExist}
              reviewState={reviewState}
              handleStarClick={handleStarClick}
            />
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
            {reviewList.map((review) => (
              <RecipeReviewCard key={review.id} review={review} />
            ))}
            {/* 마지막 리뷰 다음에 스크롤 감지용 빈 div */}
            {/* {reviewList.length < reviewsData.length && <div ref={ref} style={{ height: '1px' }} />} */}
            {hasMore && <p ref={ref}>.</p>}
          </TabContent>
        )}
      </TabListContainer>
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={handleShareModalClose}
          shareUrl={window.location.href}
        />
      )}
      {isReviewModalOpen && (
        <ReviewEditModal
          review={reviewState}
          isOpen={isReviewModalOpen}
          onChange={handleReviewChange}
          onClose={handleReviewModalClose}
          onSubmit={handleReviewSubmit}
          isEditMode={isReviewEditMode}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleLoginModalClose}
          onConfirm={handleLoginConfirm}
        />
      )}
    </Layout>
  );
};

export default RecipeDetail;
