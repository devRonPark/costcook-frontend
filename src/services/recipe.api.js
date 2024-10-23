import api from './api';

export const recipeAPI = {

    getRecipeList : () => api.get("/recipes"),
    // paginationOption: { page: 1, sort: {}, order: {}}
    // getRecipeWithPagination: (paginationOption) => api.get(`/recipes?page=${page}&size=9&sort=${sort}&order=${order}`)

}