import { useEffect } from 'react';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import LoadingComponent from '../components/common/LoadingComponent';
import UserApi from '../services/user.api';
import { toast } from 'react-toastify';
import ReviewCard from '../components/display/ReviewCard';
import ReviewEditModal from '../components/ReviewEditModal';

const MyReviewPage = () => {
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null); // 수정 대상 리뷰
  const [reviewState, setReviewState] = useState({ score: 0, comment: '' }); // 모달 내 변경되는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null);

  // 리뷰 수정 버튼 클릭 시 모달 오픈 및 수정할 리뷰 선택
  const handleEditClick = (review) => {
    setSelectedReview(review);
    setReviewState({ score: review.score, comment: review.comment });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // 모달 내 인풋 변경 시
  const handleReviewChange = (field, value) => {
    setReviewState((prevState) => ({ ...prevState, [field]: value }));
  };

  // 모달 저장 버튼 클릭 시 변경 사항 반영
  const handleReviewSubmit = () => {
    if (isEditMode) {
      // TODO: 리뷰 수정 API 연동
      const updatedReviews = myReviews.map((review) =>
        review.id === selectedReview.id ? { ...review, ...reviewState } : review
      );
      setMyReviews(updatedReviews);
      setIsModalOpen(false);
    }
  };

  const hasResults = myReviews !== null && myReviews.length > 0;

  const NoResultsMessage = () => (
    <div style={{ textAlign: 'center' }}>
      <img
        src="/not_found.png"
        alt="내가 작성한 리뷰가 없음"
        width={30}
        height={30}
      />
      <p>내가 작성한 리뷰가 없어요</p>
    </div>
  );

  const fetchReviews = async (newPage = 1) => {
    setLoading(true);
    try {
      const response = await UserApi.getMyReviewsWithPagination(newPage);
      if (response.status === 200) {
        const { reviews } = response.data;
        setMyReviews(reviews);
      } else {
        throw new Error('리뷰를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        autoClose: false, // 자동 닫기 하지 않기
        closeButton: true, // 닫기 버튼 표시
        // onClose: () => setError(null), // 닫기 버튼 클릭 시 에러 상태 초기화
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, []);

  const handleRetry = () => {
    fetchReviews(); // 재시도 로직
  };

  return (
    <Layout
      isBackBtnExist
      pageName="리뷰 관리"
      onBackClick={() => navigate('/my')}
    >
      <MyReviewContainer hasResults={hasResults}>
        {loading && (
          <LoadingComponent loading={loading} loadingText="로딩 중..." />
        )}
        {hasResults ? (
          myReviews !== null &&
          myReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditClick}
              onDelete={() => alert('리뷰 삭제 요청')}
            />
          ))
        ) : !loading ? (
          <NoResultsMessage />
        ) : null}
        {error && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: 'red' }}>{error}</p>
            <RetryButton onClick={handleRetry}>다시 시도하기</RetryButton>
          </div>
        )}
        {/* 리뷰 수정 모달 */}
        {isModalOpen && (
          <ReviewEditModal
            review={reviewState}
            isOpen={isModalOpen}
            onChange={handleReviewChange}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleReviewSubmit}
            isEditMode={isEditMode}
          />
        )}
      </MyReviewContainer>
    </Layout>
  );
};

export default MyReviewPage;

// 레시피 목록 영역
const MyReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  // hasResults가 false일 때의 스타일
  ${(props) =>
    !props.hasResults &&
    css`
      justify-content: center;
      height: 100%;
      color: #757575;
      font-weight: bold;
    `}
`;

const RetryButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #4caf50; // 재시도 버튼 배경색
  color: white; // 글자색
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049; // 호버 시 색상 변경
  }
`;
