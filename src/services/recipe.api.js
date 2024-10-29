import apiClient from './api';

export const recipeAPI = {

    getRecipeList : (page, sort, order) => apiClient.get(`/recipes?page=${page}&size=9&sort=${sort}&order=${order}`),
    getRecipe : (recipeId) => apiClient.get(`/recipes/${recipeId}`),
    getRecipeReviews : (recipeId) => apiClient.get(`/recipes/${recipeId}/reviews`),

}