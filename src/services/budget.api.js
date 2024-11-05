import apiClient from './api';

export const budgetAPI = {
  getWeeklyBudget: (year, week) =>
    apiClient.get('/users/budget', { params: { year, weekNumber: week } }),

  createWeeklyBudget: (budgetRequest) =>
    apiClient.post('/users/budget', budgetRequest),

  modifyWeeklyBudget: (budgetRequest) =>
    apiClient.patch('/users/budget', budgetRequest),

  // 사용 예산 및 레시피 정보 가져오기
  getUsedWeeklyBudget: (year, week) =>
    apiClient.get('/users/budget/used', { params: { year, weekNumber: week } }),
};
