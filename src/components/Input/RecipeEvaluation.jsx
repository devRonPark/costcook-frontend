import React, { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { reviewAPI } from '../../services/review.api';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginModal from '../common/LoginModal';
import { Reviews, Star } from '@mui/icons-material';
import ReviewEditModal from '../ReviewEditModal';

// 레시피 상세페이지 > 리뷰 등록에 대한 상태 제어.

const RecipeEvaluation = ({ setRecipeList, recipeId, isLoggedIn }) => {
  const [review, setReview] = useState({
    score: 0,
    comment: '',
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 리뷰 모달
  const [userReview, setUserReview] = useState(null); // 사용자의 리뷰
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setReview((prev) => ({ ...prev, [field]: value }));
  };

  // 점수 클릭 핸들러
  const handleStarClick = (index) => {
    // 비 로그인 유저 -> 로그인 유도
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      // 로그인 유저
      handleChange('score', index + 1);
      setIsReviewModalOpen(true);
    }
  };

  // 로그인 페이지로 이동
  const handleConfirmLogin = () => {
    navigate('/login');
  };

  // 모달 닫기
  // 로그인 모달 닫기
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  // 리뷰 모달 닫기
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setReview({ score: 0, comment: '' });
  };

  // 리뷰 제출
  const handleReviewSubmit = async () => {
    try {
      const form = {
        recipeId: recipeId,
        ...review,
      };
      console.log(form);
      const res = await reviewAPI.createReview(form);
      if (res.status === 201) {
        // 리뷰 등록 API 성공 응답: { review: ReviewResponse }
        // 리뷰 목록 state 에 추가.
        // setRecipeList((prev) => [res.data.review, ...prev]);
        setIsReviewModalOpen(false); // 모달 닫기
      } else {
        console.error('리뷰 작성 실패');
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
    }
  };

  return (
    <>
      <div>
        {/* 별점 표시 */}
        {Array(5)
          .fill()
          .map((_, index) => (
            <Star
              key={index}
              onClick={() => handleStarClick(index)}
              style={{
                cursor: 'pointer',
                color: index < review.score ? 'gold' : 'lightgray',
                fontSize: '30px',
                marginRight: '2px',
              }}
            />
          ))}
      </div>
      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onConfirm={handleConfirmLogin}
      />

      {/* 리뷰 모달 */}
      <ReviewEditModal
        review={review}
        isOpen={isReviewModalOpen}
        onChange={handleChange}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default RecipeEvaluation;
