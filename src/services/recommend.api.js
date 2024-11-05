import apiClient from './api';

export const recommendAPI = {
  // 추천 받은 레시피를 DB에 저장 (recommended_recipes 테이블)
  saveRecommendedRecipes: (recommendedRecipes) => {
    console.log('Saving Recommended Recipes:', recommendedRecipes);
    return apiClient.post(
      '/recommendations/selected-recipes',
      recommendedRecipes
    );
  },

  // 추천 받은 레시피 전체 가져오기 (recommended_recipes 테이블)
  getRecommendedRecipes: (year, weekNumber) =>
    apiClient.get(
      `/users/me/recommended-recipes?year=${year}&weekNumber=${weekNumber}`
    ),
};
