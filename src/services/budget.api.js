import apiClient from './api';

export const budgetAPI = {
  getWeeklyBudget: (year, week) =>
    apiClient.get('/users/budget', { params: { year, weekNumber: week } }),

  createWeeklyBudget: (budgetRequest) =>
    apiClient.post('/users/budget', budgetRequest),

  modifyWeeklyBudget: (budgetRequest) =>
    apiClient.patch('/users/budget', budgetRequest),
};
