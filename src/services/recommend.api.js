import apiClient from './api';

export const recommendAPI = {
  saveRecommendedRecipes: (recommendedRecipes) => {
    console.log('Saving Recommended Recipes:', recommendedRecipes);
    return apiClient.post(
      '/recommendations/selected-recipes',
      recommendedRecipes
    );
  },
};
