import apiClient from './api';

const UserApi = {
  getMyReviewsWithPagination: (page) =>
    apiClient.get(`/users/me/reviews?page=${page}`),
  getMyReviewWithRecipeId: (recipeId) =>
    apiClient.get(`/users/me/reviews?recipeId=${recipeId}`),
};

export default UserApi;
