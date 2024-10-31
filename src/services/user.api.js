import apiClient from './api';

const UserApi = {
  getMyReviewsWithPagination: (page) =>
    apiClient.get(`/users/me/reviews?page=${page}`),
};

export default UserApi;
