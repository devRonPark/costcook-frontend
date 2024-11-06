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
import ReviewApi from '../services/review.api';
import { useInView } from 'react-intersection-observer';

const MyReviewPage = () => {
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null); // 수정 대상 리뷰
  const [reviewState, setReviewState] = useState({ score: 0, comment: '' }); // 모달 내 변경되는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null);
  const { ref: lastReviewElementRef, inView } = useInView(); // 마지막 리뷰 카드 참조 및 뷰 상태

  // 리뷰 수정 버튼 클릭 시 모달 오픈 및 수정할 리뷰 선택
  const handleEditClick = (review) => {
    setSelectedReview(review);
    setReviewState({ score: review.score, comment: review.comment });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // 리뷰 삭제 확인 창에서 확인 클릭 시 리뷰 삭제 처리
  const handleDeleteClick = async (review) => {
    try {
      const res = await ReviewApi.deleteReview(review.id);

      // 삭제 성공 시 리뷰 목록에서 해당 리뷰 제거
      if (res.status === 204) {
        setMyReviews((prevReviews) =>
          prevReviews.filter((r) => r.id !== review.id)
        );
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
        handleDeleteClick(review); // 재시도
      }
    }
  };

  // 모달 내 인풋 변경 시
  const handleReviewChange = (field, value) => {
    setReviewState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleReviewSubmit = async () => {
    if (!isEditMode) return; // 수정 모드가 아닐 경우 조기 반환

    const reviewToUpdate = {
      id: selectedReview.id,
      ...reviewState,
    };

    try {
      const res = await ReviewApi.updateReview(reviewToUpdate);
      if (res.status === 200) {
        const updatedReviews = myReviews.map((review) =>
          review.id === selectedReview.id
            ? { ...review, ...reviewState } // 수정된 상태로 업데이트
            : review
        );
        setMyReviews(updatedReviews); // 상태 업데이트
        setIsModalOpen(false); // 모달 닫기
        toast.success('리뷰가 성공적으로 업데이트되었습니다!'); // 성공 메시지
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message // 서버에서 반환된 메시지 사용
          : '리뷰 업데이트에 실패했습니다. 다시 시도해 주세요.'; // 기본 메시지

      toast.error(errorMessage); // 에러 메시지 표시
    }
  };

  const hasResults = myReviews !== null && myReviews.length > 0;

  // 마지막 리뷰 카드가 보이고, 로딩 중이 아닐 때 다음 페이지 검색
  useEffect(() => {
    if (inView && !loading & (page < totalPages)) {
      setLoading(true);
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchReviews(nextPage); // 다음 페이지 렌더링
        return nextPage; // 페이지 업데이트
      });
    }
  }, [inView, loading, page, totalPages]);

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
    setLoading(true); // 로딩 시작
    try {
      const res = await UserApi.getMyReviewsWithPagination(newPage);
      if (res.status === 200) {
        const { reviews } = res.data;
        if (newPage === 1) {
          setMyReviews(reviews); // 첫 번째 조회 시 리뷰 초기화
        } else {
          setMyReviews((prev) => [...prev, ...reviews]);
        }
        setTotalPages(res.data.totalPages); // 총 페이지 수 업데이트
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
      pageName="내가 쓴 리뷰"
      onBackClick={() => navigate('/my')}
    >
      <MyReviewContainer hasResults={hasResults}>
        {loading && (
          <LoadingComponent loading={loading} loadingText="로딩 중..." />
        )}
        {hasResults ? (
          myReviews !== null &&
          myReviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              ref={index === myReviews.length - 1 ? lastReviewElementRef : null} // 마지막 카드에 ref 설정
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
