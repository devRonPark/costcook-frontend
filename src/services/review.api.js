import apiClient from './api';

export const reviewAPI = {
    createReview : () => apiClient.post(`/review`),
}


