import React, { useState } from 'react';
import styled from 'styled-components';
import ExitModal from './ExitModal';
import AdminHeader from './AdminHeader';
import AdminDrawer from './AdminDrawer';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({
  children,
  title,
  rightLabel,
  isRegisterEnabled,
  isModified,
  onSubmit,
  onBack
}) => {

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);

  // 드로어 열기
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  // 드로어 닫기
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // 메뉴 아이템 클릭 핸들러
  const handleMenuItemClick = (path) => {
    if (isModified) {
      setPendingNavigationPath(path);
      setIsModalOpen(true);
    } else {
      handleDrawerClose();
      navigate(path);
    }
  };

  // 모달에서 "예"를 클릭했을 때 동작
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (pendingNavigationPath) {
      handleDrawerClose();
      navigate(pendingNavigationPath);
      setPendingNavigationPath(null);
    }
  };

  // 모달에서 "아니요"를 클릭했을 때 동작
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingNavigationPath(null);
  };

  return (
    <Container>
      <FixedHeader>
        <AdminHeader
          title={title}
          rightLabel={rightLabel}
          isRegisterEnabled={isRegisterEnabled}
          onMenuClick={handleDrawerOpen}
          onSubmit={onSubmit}
        />
      </FixedHeader>
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onMenuItemClick={handleMenuItemClick}
      />
      <Content>{children}</Content>

      <ExitModal
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </Container>
  );
};

export default AdminLayout;

// 스타일 컴포넌트 정의
const Container = styled.div`
  position: relative;
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
  overflow: hidden;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  padding: 16px 0;
  background-color: #f8f9fa;
  z-index: 1000;
  border: 1px solid rgb(224, 224, 224);
  border-bottom: none;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;
