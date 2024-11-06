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
  RecipeImage,
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
} from '../styles/RecipeDetail';
import ShareModal from '../components/modal/ShareModal';
import RecipeInstructions from '../components/RecipeInstructions';
import ReviewEditModal from '../components/ReviewEditModal';
import LoginModal from '../components/common/LoginModal';
import ReviewApi from '../services/review.api';
import { toast } from 'react-toastify';
import UserApi from '../services/user.api';
import RecipeReviewCard from '../components/RecipeReviewCard';
import useRecipeData from '../hooks/useRecipeInfo';

const RecipeDetail = () => {
  // 접속중 유저 정보
  const { state } = useAuth();
  const { recipeId } = useParams();
  // 레시피 & 재료
  const { recipe, ingredientData, isRecipeLoaded } = useRecipeData(recipeId);
  const [myReview, setMyReview] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // 공유하기 모달 창 상태 제어

  const navigate = useNavigate();

  // 리뷰 관련 state
  const [isReviewEditMode, setIsReviewEditMode] = useState(false);
  const [reviewList, setReviewList] = useState([]); // 전체 리뷰 목록
  const [reviewLoading, setReviewLoading] = useState(false);
  const [page, setPage] = useState(1); // 리뷰 페이지
  const [totalPages, setTotalPages] = useState(1);
  const [reviewState, setReviewState] = useState({ score: 0, comment: '' }); // 모달 내 변경되는 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { ref: lastReviewElementRef, inView } = useInView(); // 스크롤 감지용 useRef
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

  const fetchMyReview = async () => {
    try {
      const res = await UserApi.getMyReviewWithRecipeId(recipeId);
      setMyReview(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 로그인한 경우에만 이 레시피에 대해 내가 작성한 리뷰 조회
  useEffect(() => {
    if (recipeId && state.isAuthenticated && state.user != null) {
      fetchMyReview();
    }
  }, [recipeId, state]);

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
      if (!!myReview) {
        toast.info('이 레시피에 대한 리뷰는 이미 작성하셨습니다.');
        handleReviewModalClose();
        return;
      }
      handleReviewModalOpen();
      handleReviewChange('score', newScore);
    }
  };

  // 리뷰 등록 요청
  const createReview = async () => {
    try {
      const form = {
        recipeId: parseInt(recipeId),
        ...reviewState,
      };
      const res = await ReviewApi.createReview(form);
      if (res.status === 201) {
        toast.success('리뷰가 성공적으로 등록되었습니다!'); // 성공 메시지
        handleReviewModalClose();
        resetReview();
        setMyReview(res.data);
        setReviewList((prev) => [res.data, ...prev]);
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
  // 리뷰 수정 버튼 클릭 시 모달 오픈 및 수정할 리뷰 선택
  const handleReviewEditBtnClick = (review) => {
    setReviewState({ score: review.score, comment: review.comment });
    setIsReviewEditMode(true);
    handleReviewModalOpen();
  };
  // 리뷰 삭제 확인 창에서 확인 클릭 시 리뷰 삭제 처리
  const handleReviewDeleteClick = async (review) => {
    try {
      const res = await ReviewApi.deleteReview(review.id);
      // 삭제 성공 시 리뷰 목록에서 해당 리뷰 제거
      if (res.status === 204) {
        setReviewList((prevReviews) =>
          prevReviews.filter((r) => r.id !== review.id)
        );
        setMyReview(null);
        toast.info('리뷰가 성공적으로 삭제되었습니다!'); // 사용자에게 성공 메시지 표시
      }
    } catch (err) {
      // 에러 발생 시 적절한 메시지 설정
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message // 서버에서 반환된 메시지 사용
          : '리뷰 삭제에 실패했습니다. 서버 오류가 발생했습니다. 다시 시도해 주세요.'; // 기본 메시지

      toast.error(errorMessage); // 에러 메시지 표시

      // 재시도 버튼 (optional)
      const retry = window.confirm(
        '리뷰 삭제에 실패했습니다. 다시 시도하시겠습니까?'
      );

      // 사용자가 재시도를 원할 경우 함수 재호출
      if (retry) {
        handleReviewDeleteClick(review); // 재시도
      }
    }
  };
  // 리뷰 등록, 수정에서 범용적으로 사용됨.
  const handleReviewSubmit = async () => {
    // 리뷰 등록
    if (!isReviewEditMode) {
      createReview();
      resetReview();
    } else {
      // 리뷰 수정
      const reviewToUpdate = {
        id: myReview.id,
        ...reviewState,
      };

      try {
        const res = await ReviewApi.updateReview(reviewToUpdate);
        console.log(res.data);
        if (res.status === 200) {
          const updatedReviews = reviewList.map((review) =>
            review.id === myReview.id
              ? { ...myReview, ...reviewState } // 수정된 상태로 업데이트
              : review
          );
          setMyReview(res.data);
          setReviewList(updatedReviews); // 상태 업데이트
          handleReviewModalClose();
          toast.success('리뷰가 성공적으로 업데이트되었습니다!'); // 성공 메시지
        }
      } catch (error) {
        // 에러 발생 시 적절한 메시지 설정
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message // 서버에서 반환된 메시지 사용
            : '리뷰 업데이트에 실패했습니다. 서버 오류가 발생했습니다. 다시 시도해 주세요.'; // 기본 메시지

        toast.error(errorMessage); // 에러 메시지 표시

        // 재시도 버튼 (optional)
        const retry = window.confirm(
          '리뷰 업데이트에 실패했습니다. 다시 시도하시겠습니까?'
        );

        // 사용자가 재시도를 원할 경우 함수 재호출
        if (retry) {
          handleReviewSubmit(); // 재시도
        }
      }
    }
  };

  // DB의 리뷰 데이터 가져오기
  const fetchReviews = async (newPage = 1) => {
    setReviewLoading(true); // 로딩 시작
    try {
      const res = await recipeAPI.getRecipeReviews(recipeId, newPage);
      if (res.status === 200) {
        const { reviews, totalPages } = res.data;
        if (newPage === 1) {
          setReviewList(reviews);
        } else {
          setReviewList((prev) => [...prev, ...reviews]);
        }
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error('리뷰를 가져오는 데 실패했습니다.');
    } finally {
      setReviewLoading(false);
    }
  };

  // 스크롤 시 페이지 증가
  useEffect(() => {
    if (inView && !reviewLoading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, reviewLoading, page, totalPages]); // 스크롤 끝에 올 때마다 호출

  // 페이지 변경 시 마다 추가 리뷰 로드
  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  return (
    <Layout
      isBackBtnExist
      pageName={recipe.title}
      isRecipeDetailPage
      onShareClick={handleShareModalOpen}
    >
      <RecipeImage>
        <ImageDisplay
          objectFit={'cover'}
          height={'100%'}
          width={'100%'}
          borderRadius={'0%'}
          altText={recipe.title}
          src={`${import.meta.env.VITE_BASE_SERVER_URL}${recipe.thumbnailUrl}`}
        ></ImageDisplay>
      </RecipeImage>

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
              isMyReviewExist={!!myReview}
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
            {reviewList.map((review, index) => (
              <RecipeReviewCard
                key={review.id}
                review={review}
                onEdit={handleReviewEditBtnClick}
                onDelete={handleReviewDeleteClick}
                loginUserId={state?.user?.id !== null ? state?.user?.id : -1}
                ref={
                  index === reviewList.length - 1 ? lastReviewElementRef : null
                }
              />
            ))}
          </TabContent>
        )}
      </TabListContainer>

      {/* 공유 모달 */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={handleShareModalClose}
          shareUrl={window.location.href}
        />
      )}
      {/* 리뷰 등록 및 수정 모달 */}
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
      {/* 로그인 유도 모달 */}
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
