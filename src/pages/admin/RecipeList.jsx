import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Visibility, FavoriteBorder, Comment, Edit, Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import recipes from '../../assets/data/recipes.json';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';

const AdminRecipeList = () => {
  const [recipeList, setRecipeList] = useState(recipes);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipeList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddRecipe = () => {
    navigate('/admin/recipe-form');
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/admin/recipe-form/${recipeId}`);
  };

  return (
    <AdminLayout
      title="레시피"
      rightLabel="추가"
      onRightButtonClick={handleAddRecipe}
    >
      <ContentContainer>
        <RecipeListWrapper>
          {currentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id}>
              <Thumbnail src="https://via.placeholder.com/50" alt="썸네일 이미지" />
              <RecipeInfo>
                <RecipeName>{recipe.title}</RecipeName>
                <RecipeMetrics>
                  <Metric><Visibility style={{ fontSize: '16px', color: '#999' }} /> <MetricText>{recipe.view_count}</MetricText></Metric>
                  <Metric><FavoriteBorder style={{ fontSize: '16px', color: '#999' }} /> <MetricText>{recipe.bookmark_count}</MetricText></Metric>
                  <Metric><Comment style={{ fontSize: '16px', color: '#999' }} /> <MetricText>{recipe.comment_count}</MetricText></Metric>
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
          ))}
        </RecipeListWrapper>

        <PaginationWrapper>
          <Pagination
            count={Math.ceil(recipeList.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </PaginationWrapper>
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


