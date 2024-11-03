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
  // HomePage [더보기] -> RecipeList
  getMoreRecipeList: () =>
    apiClient.get(`/recipes?page=1&size=9&sort=viewCount&order=desc`),
};
