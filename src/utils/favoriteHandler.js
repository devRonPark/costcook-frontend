import { toast } from 'react-toastify';
import { favoriteAPI } from '../services/favorite.api';
import {
  addFavoriteRecipeId,
  removeFavoriteRecipeId,
} from './sessionStorageUtil';

// @param recipe : 업데이트 대상 recipe 데이터
// @param favoriteToUpdate : true > 즐겨찾기 추가 요청, false > 즐겨찾기 삭제 요청
export const handleToggleFavorite = async (
  recipe,
  favoriteToUpdate,
  isAuthenticated
) => {
  try {
    if (isAuthenticated) {
      if (favoriteToUpdate) {
        // 회원 > 즐겨찾기 추가 요청
        await favoriteAPI.addFavorite([recipe.id]);
        addFavoriteRecipeId(recipe.id); // 세션 스토리지에 추가
        toast.info('즐겨찾기에 성공적으로 추가되었습니다.');
      } else {
        // 회원 > 즐겨찾기 삭제 요청
        await favoriteAPI.removeFavorite(recipe.id);
        removeFavoriteRecipeId(recipe.id); // 세션 스토리지에서 제거
        toast.info('즐겨찾기에서 성공적으로 제거되었습니다.');
      }
    } else {
      if (favoriteToUpdate) {
        addFavoriteRecipeId(recipe.id); // 비회원 > 세션 스토리지에 추가
        toast.info('즐겨찾기에 추가되었습니다.');
      } else {
        removeFavoriteRecipeId(recipe.id); // 비회원 > 세션 스토리지에서 제거
        toast.info('즐겨찾기에서 제거되었습니다.');
      }
    }
  } catch (error) {
    console.error(error);
    toast.error('즐겨찾기 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};
