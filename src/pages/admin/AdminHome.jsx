import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import styled from 'styled-components';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleAlert = (message) => {
    alert(message);
  };

  return (
    <AdminLayout
      title="관리자 홈"
      isRegisterEnabled={true}
      onBack={() => navigate("/")}
    >
      <BoxContainer>
        <Box onClick={() => navigate('/admin/recipe-list')}>레시피</Box>
        <Box onClick={() => navigate('/admin/ingredient-list')}>재료</Box>
        <Box onClick={() => navigate('/admin/review-list')}>리뷰</Box>
        <Box onClick={() => handleAlert("업데이트 예정")}>회원</Box>
      </BoxContainer>
    </AdminLayout>
  );
};

export default AdminHome;

// 스타일 컴포넌트
const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
  margin-top: 50px;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  }
`;
