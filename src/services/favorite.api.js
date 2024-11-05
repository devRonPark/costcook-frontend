import apiClient from './api';

export const favoriteAPI = {
  // 즐겨찾기 추가 요청
  addFavorite: (recipeIds) => apiClient.post('/favorites', { recipeIds }),

  // 즐겨찾기 삭제 요청
  removeFavorite: (recipeId) =>
    apiClient.delete(`/favorites?recipeIds=${recipeId}`),

  // 여러 개의 즐겨찾기 삭제 요청 (옵션)
  removeFavorites: (recipeIds) =>
    apiClient.delete(`/favorites?recipeIds=${recipeIds.join(',')}`),

  // 즐겨찾기 목록 조회 요청
  getFavorites: (page) => apiClient.get(`/favorites?page=${page}`),
};
