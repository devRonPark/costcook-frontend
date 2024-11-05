import apiClient from './api';

export const recommendAPI = {
  saveRecommendedRecipes: (recommendedRecipes) => {
    return apiClient.post(
      '/recommendations/selected-recipes',
      recommendedRecipes
    );
  },

  getRecommendedRecipes: (year, weekNumber) =>
    apiClient.get(
      `/users/me/recommended-recipes?year=${year}&weekNumber=${weekNumber}`
    ),

  deleteRecommendedRecipes: (year, weekNumber) => {
    return apiClient.delete(`/recommendations/selected-recipes`, {
      data: {
        year: year,
        weekNumber: weekNumber,
      },
    });
  },

  getUsedRecipe: (recipe) => {
    apiClient.get(
      `/users/me/used-recipes?year=${year}&weekNumber=${weekNumber}`
    );
  },

  modifyUseRecipe: (recipe) => {
    return apiClient.patch(
      `/recommendations/recipes/${recipe.recipeId}/use`,
      recipe
    );
  },
};
