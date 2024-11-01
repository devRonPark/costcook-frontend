// AdminDrawer.js - 외부 AdminDrawer 컴포넌트
import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';

const AdminDrawer = ({ isOpen, title, children, onClose }) => {
  return (
    <DrawerContainer isOpen={isOpen}>
      <DrawerHeader>
        <Title>{title}</Title>
        <CloseButton onClick={onClose}>
          <CloseIconStyled />
        </CloseButton>
      </DrawerHeader>
      <DrawerContent>{children}</DrawerContent>
    </DrawerContainer>
  );
};

export default AdminDrawer;

// 스타일 컴포넌트 정의
const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px;
  max-width: 80%;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1200;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #343a40;
  color: #ffffff;
  border-bottom: 1px solid #ddd;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const CloseButton = styled.div`
  cursor: pointer;
  color: #ffffff;
  &:hover {
    color: #ffc107;
  }
`;

const CloseIconStyled = styled(CloseIcon)`
  width: 24px;
  height: 24px;
`;

const DrawerContent = styled.div`
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 64px);
`;
