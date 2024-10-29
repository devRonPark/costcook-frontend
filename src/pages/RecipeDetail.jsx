import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Layout from '../components/layout/Layout';
import { recipeAPI } from '../services/recipe.api';
import { StarRating } from '../utils/StarRating';
import { formatPrice } from '../utils/formatData';
import RecipeEvaluation from '../components/Input/RecipeEvaluation';
import { useInView } from 'react-intersection-observer';
import ImageDisplay from '../components/display/ImageDisplay';
import { toast } from 'react-toastify';

const RecipeDetail = () => {
  // 레시피 & 재료
  const {recipeId} = useParams();
  const [recipe, setRecipe] = useState({}); // 전체 레시피 정보
  const [ingredientData, setIngredientData] = useState([]); // 재료 정보

  // 평가
  const [userScore, setUserScore] = useState(null); // 사용자의 평가 상태
  const [review, setReview] = useState(''); // 리뷰 내용
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 열림 상태

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
      setRecipe(res.data)
      console.log("레시피 정보: ", res.data);

      // 재료 데이터
      const ingredients = res.data.ingredients.map((item) => ({
        name : item.ingredientName,
        quantity : item.quantity,
        unit : item.unitName,
        price : Math.round(item.price * item.quantity), // 정수값만 출력
        categoryId : item.category.id,
        categoryName : item.category.name
      }));
      setIngredientData(ingredients);
      console.log("재료 정보 : ", ingredients)

    } catch (error) {
      console.log("레시피를 불러올 수 없음", error);
    }
  }
  // 가져온 정보 보여주기
    useEffect(() => {
      getRecipeById();
  }, []);



  // 리뷰 관련 메소드
  // 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const res = await recipeAPI.getRecipeReviews(recipeId, page);
      console.log("리뷰 데이터 : ", res.data.reviews);      
      if (res.data.reviews.length === 0 ) {
        toast.info('더 이상 불러올 데이터가 없습니다.');
        setHasMore(false);
        return;
      }
      // 기존 리뷰에 새 리뷰 추가
      setReviewList((prevReviews) => [...res.data.reviews, ...prevReviews]);


      console.log("전체 데이터 : ", res.data);
    } catch (error) {
      console.error("리뷰 불러오기 오류", error)
    }
  }

  // 스크롤 시 페이지 증가
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]); // 스크롤 끝에 올 때마다 호출

  // 페이지 변경 시 마다 추가 리뷰 로드
  useEffect(() => {
    console.log("리뷰페이지 : ", page)
    fetchReviews();
  }, [page]);







  // 리뷰 제출 핸들러
  const handleSubmitScore = (score, review) => {
    // review테이블에 score, review를 저장하는 로직 필요

    // 리뷰 제출 API 구현 필요
    // 예) api.submitScore(recipeId, score, review);
    
    // 평가 후 상태 업데이트
    setUserScore(score);
    setReview(review);
  };




  return (
    <Layout isBackBtnExist pageName={recipe.title} isRecipeDetailPage>
      <ReceiptImage>
        <ImageDisplay 
          objectFit={"cover"}
          height={"100%"}
          width={"100%"}
          borderRadius={"0%"}
          altText={recipe.title}
          src={`${import.meta.env.VITE_SERVER}${recipe.thumbnailUrl}`}/>
      </ReceiptImage>
      
      <ScoreContainer>
        <ScoreSubContainer text="center"><StarRating ratings={recipe.avgRatings} /></ScoreSubContainer>
        <ScoreSubContainer text="center">평점 {recipe.avgRatings}</ScoreSubContainer>
        {/* "리뷰보기" 버튼 클릭 시 스크롤 이동 */}
        <ScoreSubContainer style={{cursor:'pointer'}} text="center" onClick={scrollToReview}>
          리뷰보기
        </ScoreSubContainer>
      </ScoreContainer>
      <TabListContainer>
        <TabList onClick={() => handleTabClick('ingredients')}>
          {activeTabs.includes('ingredients')
            ? <> 레시피 재료 (1인분 기준) {recipe.price ? formatPrice(recipe.price) : 0}원 </>
            : '레시피 재료'
          }

          {activeTabs.includes('ingredients') ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </TabList>
        {activeTabs.includes('ingredients') && (
          <TabContent>

          <div style={{ display: 'block', width: '100%' }}>
              {/* 왼쪽: 재료 */}
              <div style={{ width: '50%', display: 'inline-block', textAlign: 'left', padding: '10px', verticalAlign: 'top' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {ingredientData
                    .filter(ingredient => ingredient.categoryId !== 10)
                    .map((ingredient, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {ingredient.name} {ingredient.quantity}{ingredient.unit}
                      </span>
                      {/* 가격정보 오른쪽정렬 */}
                      <span style={{ textAlign: 'right' }}>
                        {formatPrice(ingredient.price)}원
                      </span>
                    </li>
                    ))}
                </ul>
              </div>

              {/* 오른쪽: 양념(카테고리ID=10) */}
              <div style={{ width: '50%', display: 'inline-block', textAlign: 'left', padding: '10px', verticalAlign: 'top' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {ingredientData
                    .filter(ingredient => ingredient.categoryId === 10)
                    .map((ingredient, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {ingredient.name} {ingredient.quantity}{ingredient.unit}
                      </span>
                      {/* 가격정보 오른쪽정렬 */}
                      <span style={{ textAlign: 'right' }}>
                        {formatPrice(ingredient.price)}원
                      </span>
                    </li>
                    ))}
                </ul>
              </div>
            </div>

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
            
            {/* 만개 레시피 경로이동 */}
            "이 레시피의 조리방법은 만개의 레시피에서 제공됩니다."
            <br/>
            (경로 이동 - 아이콘) 만들기
    


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
           <RecipeEvaluation
            userScore={userScore}
            setUserScore={setUserScore}
            review={review}
            setReview={setReview}
            onSubmitScore={handleSubmitScore}
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
          />
          {/* 평가 상태에 따른 메시지 표시 */}
          {!userScore ? (
            <p>레시피를 평가해주세요.</p>
          ) : (
            <p>평가 해주셔서 감사합니다.</p>
          )}
          </TabContent>
        )}
        
        {/* RecipeEvaluation.jsx에 모달 포함되어있음 */}
        {modalIsOpen && (
        <div className="modal">
          {/* 모달 내용 */}
          <h2>리뷰 작성하기</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="리뷰를 작성하세요"
          />
          <button onClick={() => handleSubmitScore(userScore, review)}>제출</button>
          <button onClick={() => setModalIsOpen(false)}>닫기</button>
        </div>
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
              <ReviewContainer key={review.id}>
                <ReviewImage><img src='' alt='리뷰이미지'/></ReviewImage>
                <ReviewTextContainer>

                  {/* 생성일 표기 */}
                  <span>{review.createdAt}</span>

                  <TitleText>{review.user.nickname}</TitleText>
                  <StarText>{'★'.repeat(review.score)}</StarText>
                  <ContentText>{review.comment}</ContentText>
                </ReviewTextContainer>
              </ReviewContainer>
            ))}

            {/* 마지막 리뷰 다음에 스크롤 감지용 빈 div */}
            {/* {reviewList.length < reviewsData.length && <div ref={ref} style={{ height: '1px' }} />} */}

            <LoadingBox>
              {hasMore && (
                <p ref={ref}>로딩 중...</p>
              )}
            </LoadingBox>

          </TabContent>
        )}

      </TabListContainer>
    </Layout>
  );
};

export default RecipeDetail;

const ReceiptImage = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreContainer = styled.div`
  height: 50px;
  width: 100%;
  margin: 20px 0px;
  border-bottom: 1px black solid;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const ScoreSubContainer = styled.div`
  height: 50px;
  width: 30%;
  border: 1px black solid;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: ${(props) =>
    props.text || 'flex-start'}; /* 기본값은 'flex-start'로 설정 */
`;

const TabListContainer = styled.div`
  width: 100%;
  border: 1px black solid;
`;

const TabList = styled.div`
  width: 100%;
  height: 50px;
  margin: 10px 0px;
  border: 1px black solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* 아이콘과 텍스트 세로 중앙 정렬 */
  cursor: pointer; /* 클릭 가능하게 변경 */
  padding-left: 10px;
`;

const TabContent = styled.div`
  width: 100%;
  // min-height: 200px;
  min-height: 150px;
  margin: 10px 0px;
  border: 1px black solid;
  display: flex;
  align-items: center;
  // justify-content: center;
  flex-direction: column;
`;

const ReviewContainer = styled.div`
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  margin-top: 10px;
`;

const ReviewTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewImage = styled.div`
  height: 100px;
  width: 100px;
  border-right: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.h3`
  margin: 3px 0 0 0;
`;

const ContentText = styled.a`
  margin: 3px 0;
`;

const StarText = styled.a`
  font-size: 13px;
`;



// 데이터 추가 로드 시 하단 로딩 텍스트 영역
const LoadingBox = styled.div`
  width: 100%;
  text-align: center;
  margin: 10px;
`;