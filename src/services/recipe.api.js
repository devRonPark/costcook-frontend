import apiClient from './api';

export const recipeAPI = {
    getRecipeList : (page, sort, order) => apiClient.get(`/recipes?page=${page}&size=9&sort=${sort}&order=${order}`),
    getRecipeById : (recipeId) => apiClient.get(`/recipes/${recipeId}`),
    // getReviewsByRecipeIdWithPagination
    getRecipeReviews : (recipeId, page) => apiClient.get(`/recipes/${recipeId}/reviews?page=${page}`),
}
