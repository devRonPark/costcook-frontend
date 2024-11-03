import apiClient from './api';

export const recipeAPI = {
  getRecipeList: (page, sort, order) =>
    apiClient.get(`/recipes?page=${page}&size=9&sort=${sort}&order=${order}`),
  getRecipeById: (recipeId) => apiClient.get(`/recipes/${recipeId}`),
  // getReviewsByRecipeIdWithPagination
  getRecipeReviews: (recipeId, page) =>
    apiClient.get(`/recipes/${recipeId}/reviews?page=${page}`),
  searchRecipeList: ({ keyword, page }) =>
    apiClient.get(`/recipes/search?keyword=${keyword}&page=${page}`),
  getRecipesByBudget: (minBudget, maxBudget) =>
    apiClient.get(
      `/recommendations/recipes?minBudget=${minBudget}&maxBudget=${maxBudget}`
    ),
  // HomePage 조회수 높은 순 레시피 가져오기 (인기레시피, 더보기 -> RecipeList)
  getMoreRecipeList: (size) =>
    apiClient.get(`/recipes?page=1&size=${size}&sort=viewCount&order=desc`),
};
