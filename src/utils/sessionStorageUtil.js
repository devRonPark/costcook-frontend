// 즐겨찾기 추가 함수
export const addFavoriteRecipeId = (recipeId) => {
  const favoriteRecipeIds =
    JSON.parse(sessionStorage.getItem('favoriteRecipeIds')) || [];
  if (!favoriteRecipeIds.includes(recipeId)) {
    favoriteRecipeIds.push(recipeId);
    sessionStorage.setItem(
      'favoriteRecipeIds',
      JSON.stringify(favoriteRecipeIds)
    );
  }
};

// 즐겨찾기 삭제 함수
export const removeFavoriteRecipeId = (recipeId) => {
  const favoriteRecipeIds =
    JSON.parse(sessionStorage.getItem('favoriteRecipeIds')) || [];
  const updatedFavorites = favoriteRecipeIds.filter((id) => id !== recipeId);
  sessionStorage.setItem('favoriteRecipeIds', JSON.stringify(updatedFavorites));
};

// 즐겨찾기 삭제 함수 (여러 레시피 일괄 삭제)
export const removeFavoriteRecipeIds = (recipeIds) => {
  const favoriteRecipeIds =
    JSON.parse(sessionStorage.getItem('favoriteRecipeIds')) || [];
  const updatedFavorites = favoriteRecipeIds.filter(
    (id) => !recipeIds.includes(id)
  );
  sessionStorage.setItem('favoriteRecipeIds', JSON.stringify(updatedFavorites));
};

// 모든 즐겨찾기 가져오기 함수
export const getFavoriteRecipeIds = () => {
  return JSON.parse(sessionStorage.getItem('favoriteRecipeIds')) || [];
};

// 즐겨찾기 비우기 함수
export const clearFavoriteRecipeIds = () => {
  return sessionStorage.removeItem('favoriteRecipeIds');
};
