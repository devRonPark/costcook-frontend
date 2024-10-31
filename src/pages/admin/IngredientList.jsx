import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Edit, Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContainer from '../../components/admin/ContentContainer';
import apiClient from '../../services/api';

const AdminIngredientList = () => {
  const navigate = useNavigate();

  // 더미 데이터 설정
  const [ingredientList, setIngredientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API 호출을 통해 재료 목록 가져오기

  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get('/admin/ingredients'); 
      setIngredientList(response.data);
    } catch (error) {
      console.error('재료 목록을 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // 현재 페이지에 맞는 재료 목록
  const currentIngredients = ingredientList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditIngredient = (ingredientId) => {
    navigate(`/admin/ingredient-form`, { state: { ingredientId } });
  };

  const handleDeleteIngredient = (ingredientId) => {
    const isConfirmed = window.confirm(`재료 ID: ${ingredientId}를 삭제하시겠습니까?`);
    if (isConfirmed) {
      setIngredientList((prevList) => prevList.filter((ingredient) => ingredient.id !== ingredientId));
    }
  };

  return (
    <AdminLayout
      title="재료 목록"
      rightLabel="추가"
      isRegisterEnabled={true}
      onSubmit={() => navigate('/admin/ingredient-form')}
      onBack={() => navigate("/admin")}
    >
      <ContentContainer>
        <IngredientListWrapper>
          {currentIngredients.length > 0 ? (
            currentIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.id}>
                <IngredientInfo>
                  <IngredientID>{ingredient.id}</IngredientID>
                  <IngredientName>{ingredient.name}</IngredientName>
                </IngredientInfo>
                <ActionButtons>
                  <Tooltip title="수정">
                    <IconButton onClick={() => handleEditIngredient(ingredient.id)}>
                      <Edit style={{ fontSize: '22px', color: '#1976d2' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="삭제">
                    <IconButton onClick={() => handleDeleteIngredient(ingredient.id)}>
                      <Delete style={{ fontSize: '22px', color: '#f44336' }} />
                    </IconButton>
                  </Tooltip>
                </ActionButtons>
              </IngredientCard>
            ))
          ) : (
            <p>재료가 없습니다.</p>
          )}
        </IngredientListWrapper>

        <PaginationWrapper>
          <Pagination
            count={Math.ceil(ingredientList.length / itemsPerPage)}
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

export default AdminIngredientList;

// 스타일 컴포넌트
const IngredientListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 60px;
`;

const IngredientCard = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd; 
  border-radius: 0; 
  margin: 0; 
  padding: 8px;
  width: 100%;
  max-width: 600px;
  height: 40px;
`;

const IngredientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IngredientID = styled.span`
  font-size: 0.9rem;
  color: #333;
  padding-right: 8px;
  border-right: 1px solid #ddd;
  width: 50px;
  text-align: right; 
`;

const IngredientName = styled.h3`
  margin: 0;
  padding-left: 8px;
  font-size: 0.9rem;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
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