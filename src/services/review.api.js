import apiClient from './api';

const ReviewApi = {
  // 리뷰 등록
  createReview: ({ recipeId, score, comment }) =>
    apiClient.post('/reviews', { recipeId, score, comment }),
  // 리뷰 업데이트
  updateReview: ({ id, score, comment }) =>
    apiClient.patch(`/reviews/${id}`, { score, comment }),
  // 리뷰 삭제
  deleteReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}`),
};

export default ReviewApi;
