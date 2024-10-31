import apiClient from './api';

export const reviewAPI = {
    createReview : (reviewData) => apiClient.post(`/reviews`, reviewData),
    modifyReview : (reviewId, reviewData) => apiClient.patch(`/reviews/${reviewId}`, reviewData),
}


