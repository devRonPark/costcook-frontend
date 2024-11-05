import React, { useEffect } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';  // Recipe 아이콘
import RiceBowlIcon from '@mui/icons-material/RiceBowl';  // Ingredient 아이콘
import CommentIcon from '@mui/icons-material/Comment'; // Review 아이콘
import { useLocation } from 'react-router-dom';

const AdminDrawer = ({ isOpen, onClose, onMenuItemClick }) => {

  const location = useLocation();
  const isPathActive = (path) => location.pathname === path;

  const handleMenuClick = (path) => {
    onMenuItemClick(path);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <Overlay onClick={onClose} />}
      <DrawerContainer isOpen={isOpen}>
        <DrawerHeader>
          <Title onClick={() => handleMenuClick('/admin')}>COSTCOOK</Title>
          <CloseButton onClick={onClose}>
            <CloseIconStyled />
          </CloseButton>
        </DrawerHeader>
        <DrawerContent>
          <MenuItem
            onClick={() => handleMenuClick('/admin/recipe-list')}
            className={isPathActive('/admin/recipe-list') ? 'active' : ''}
          >
            <RecipeIcon /> 레시피
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuClick('/admin/ingredient-list')}
            className={isPathActive('/admin/ingredient-list') ? 'active' : ''}
          >
            <IngredientIcon /> 재료
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuClick('/admin/review-list')}
            className={isPathActive('/admin/review-list') ? 'active' : ''}
          >
            <ReviewIcon /> 리뷰
          </MenuItem>
        </DrawerContent>
      </DrawerContainer>
    </>
  );
};

export default AdminDrawer;

// 스타일 컴포넌트 정의
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  cursor: pointer;
`;

const DrawerContainer = styled.div`
  position: absolute;
  top: ${(props) => window.scrollY}px;  // 현재 스크롤된 위치만큼 드로어의 위치를 동적으로 조정
  left: 0;
  height: 100vh;
  width: 350px;
  max-width: 70%;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  z-index: 1200;
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #343a40;
  color: #ffffff;
  border-bottom: 1px solid #ddd;
  position: relative; 
`;

const Title = styled.h2`
  cursor: pointer;
  font-size: 1.25rem;
  margin: 0;
  text-align: center;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  width: 100%;
  font-size: 1.2rem;
  font-weight: 500;
  color: #343a40;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f5;
    color: #343a40;
  }

  &.active {
    background-color: #e0e7ff;
    color: #007bff;
  }

  &.active:hover {
    background-color: #f0f0f5;
    color: #343a40;
  }
`;

const RecipeIcon = styled(DescriptionIcon)`
  margin-right: 16px;
  font-size: 1.6rem;
  color: inherit;
`;

const IngredientIcon = styled(RiceBowlIcon)`
  margin-right: 16px;
  font-size: 1.6rem;
  color: inherit;
`;

const ReviewIcon = styled(CommentIcon)`
  margin-right: 16px;
  font-size: 1.6rem;
  color: inherit;
`;

