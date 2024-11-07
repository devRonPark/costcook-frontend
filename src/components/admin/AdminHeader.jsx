import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ title, rightLabel, isRegisterEnabled, onMenuClick, onSubmit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null); // 타이머를 저장하기 위한 useRef

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // 타이머를 취소
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // 마우스를 뗄 때 약간의 지연을 두고 모달을 닫음
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); 
  };

  const handleLogout = () => {
    // 로그아웃 로직
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <HeaderContainer>
      <TopSection>
        <IconWrapper onClick={onMenuClick}>
          <MenuIconStyled />
        </IconWrapper>
        <Title>{title}</Title>
        <ProfileThumbnail
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ThumbnailImage />
          {isDropdownOpen && (
            <DropdownMenu onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <MenuItem onClick={() => navigate('/admin')}>
                <IconLabel>
                  <HomeIconStyled fontSize="small" />
                  <span>메인 페이지</span>
                </IconLabel>
                <ArrowIcon />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <IconLabel>
                  <LogoutIconStyled fontSize="small" />
                  <span>로그아웃</span>
                </IconLabel>
                <ArrowIcon />
              </MenuItem>
            </DropdownMenu>
          )}
        </ProfileThumbnail>
      </TopSection>
      {rightLabel && (
        <BottomSection>
          <RegisterLabel
            isEnabled={isRegisterEnabled}
            onClick={isRegisterEnabled ? onSubmit : undefined}
          >
            {rightLabel}
          </RegisterLabel>
        </BottomSection>
      )}
    </HeaderContainer>
  );
};

export default AdminHeader;

// 스타일 컴포넌트 정의
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #343a40; 
  color: #fff;
  z-index: 1000;
`;

const TopSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  color: #ffffff;
  &:hover {
    color: #ffc107;
  }
`;

const MenuIconStyled = styled(MenuIcon)`
  width: 24px;
  height: 24px;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const ProfileThumbnail = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
`;

const ThumbnailImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #aaa;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px; 
  right: 0;
  width: 260px;
  background-color: #3b3b3b;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 12px 0;
  color: #fff; /* 흰색 텍스트 */
  z-index: 1000;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  cursor: pointer;
  color: #ffffff;
  &:hover {
    background-color: #4c4c4c;
    color: #ffc107;
    svg {
      color: #ffc107;
    }
  }
`;

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HomeIconStyled = styled(HomeIcon)`
  color: #fff; 
`;

const LogoutIconStyled = styled(LogoutIcon)`
  color: #fff; 
`;

const ArrowIcon = styled(ArrowForwardIosIcon)`
  color: #999;
  font-size: 1rem;
`;

const BottomSection = styled.div`
  width: 100%;
  background-color: #282c34;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RegisterLabel = styled.span`
  font-size: 1rem;
  color: ${(props) => (props.isEnabled ? '#007bff' : '#aaa')};
  cursor: ${(props) => (props.isEnabled ? 'pointer' : 'not-allowed')};
  font-weight: bold;
  margin-right: 5px;
`;