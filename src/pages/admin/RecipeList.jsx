import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Visibility, FavoriteBorder, Comment, Edit, Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import apiClient from '../../services/api';

const AdminRecipeList = () => {
 
  const navigate = useNavigate();

  // API 호출을 위한 useEffect
  const [recipeList, setRecipeList] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await apiClient.get('/recipes', {
        params: {
          page: currentPage - 1, // 서버에서 페이지는 0부터 시작
          size: itemsPerPage,
          sort: 'createdAt',
          order: 'desc',
        },
      });
      setRecipeList(response.data.recipes);
      setTotalPages(response.data.totalPages);

      console.log('레시피 데이터:', response.data.recipes);
      console.log('썸네일 경로 확인:');
      response.data.recipes.forEach((recipe) => {
        console.log(`레시피 제목: ${recipe.title}, 썸네일 URL: ${recipe.thumbnailUrl}`);
      });
    } catch (error) {
      console.error('레시피 목록을 불러오는 중 오류 발생:', error);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddRecipe = () => {
    // navigate to the recipe form page
    navigate('/admin/recipe-form');
  };

  const handleEditRecipe = (recipeId) => {
    const editingRecipe = recipeList.find(recipe => recipe.id === recipeId);
    navigate(`/admin/recipe-form/${recipeId}`, { state: { recipe: editingRecipe } });
  };

  return (
    <AdminLayout
      title="레시피"
      rightLabel="추가"
      isRegisterEnabled={true} // 등록 버튼 활성화 조건을 항상 true로 설정
      onSubmit={handleAddRecipe} // 추가 버튼을 눌렀을 때 handleAddRecipe 호출
    >
      <ContentContainer>
        <ContentContainer>
          <RecipeListWrapper>
            {recipeList && recipeList.length > 0 ? (
              recipeList.map((recipe) => (
                <RecipeCard key={recipe.id}>
                  <Thumbnail 
                    src={recipe.thumbnailUrl ? BASE_SERVER_URL + recipe.thumbnailUrl : "https://via.placeholder.com/50"} 
                    alt="썸네일 이미지" 
                  />
                  <RecipeInfo>
                    <RecipeName>{recipe.title}</RecipeName>
                    <RecipeMetrics>
                      <Metric>
                        <Visibility style={{ fontSize: '16px', color: '#999' }} />
                        <MetricText>{recipe.viewCount}</MetricText>
                      </Metric>
                      <Metric>
                        <FavoriteBorder style={{ fontSize: '16px', color: '#999' }} />
                        <MetricText>{recipe.bookmarkCount}</MetricText>
                      </Metric>
                      <Metric>
                        <Comment style={{ fontSize: '16px', color: '#999' }} />
                        <MetricText>{recipe.commentCount}</MetricText>
                      </Metric>
                    </RecipeMetrics>
                  </RecipeInfo>
                  <ActionButtons>
                    <Tooltip title="수정">
                      <IconButton onClick={() => handleEditRecipe(recipe.id)}>
                        <Edit style={{ fontSize: '22px', color: '#1976d2' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="삭제">
                      <IconButton onClick={() => setRecipeList(recipeList.filter((r) => r.id !== recipe.id))}>
                        <Delete style={{ fontSize: '22px', color: '#f44336' }} />
                      </IconButton>
                    </Tooltip>
                  </ActionButtons>
                </RecipeCard>
              ))
            ) : (
              <p>레시피를 불러오는 중입니다...</p> // 로딩 중일 때 표시할 내용
            )}
          </RecipeListWrapper>

          <PaginationWrapper>
          <Pagination
            count={totalPages} 
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
          </PaginationWrapper>
        </ContentContainer>
      </ContentContainer>
    </AdminLayout>
  );
};

export default AdminRecipeList;

const RecipeListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const RecipeCard = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
`;

const Thumbnail = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
`;

const RecipeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 8px;
  height: 50px;
`;

const RecipeName = styled.h3`
  margin: 0;
  font-size: 0.85rem;
  font-weight: bold;
`;

const RecipeMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
`;

const Metric = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const MetricText = styled.span`
  font-size: 0.7rem;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;


