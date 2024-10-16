// src/components/admin/AdminLayout.js
import React from 'react';
import styled from 'styled-components';
import Header from '../layout/Header';

const AdminLayout = ({ children }) => (
  <Container>
    <FixedHeader>
      <Header />
    </FixedHeader>
    <Content>{children}</Content>
  </Container>
);

export default AdminLayout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 8px;
  background-color: white;
  padding-top: 64px; /* 헤더 고정에 따른 여유 공간 확보 */
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 50%; /* 중앙 정렬 */
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  padding: 16px 0; /* 위아래로 padding 설정 */
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 1000;
  
  /* 전체 테두리를 적용하되 하단 테두리만 제거 */
  border: 1px solid rgb(224, 224, 224);
  border-bottom: none;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 64px; /* 고정된 헤더 높이만큼 여백 추가 */
  overflow-y: auto; /* 콘텐츠 스크롤 */
`;