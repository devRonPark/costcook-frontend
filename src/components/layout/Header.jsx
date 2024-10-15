import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home'; // MUI Home 아이콘
import SearchIcon from '@mui/icons-material/Search'; // MUI Search 아이콘
import { Link } from 'react-router-dom';

const Header = () => (
  <HeaderContainer>
    <IconWrapper>
      <Link to="/">
        <HomeIconStyled />
      </Link>
    </IconWrapper>
    <IconWrapper>
      <Link to="/search">
        <SearchIconStyled />
      </Link>
    </IconWrapper>
  </HeaderContainer>
);

export default Header;

const HeaderContainer = styled.header`
  box-sizing: border-box;
  flex: 1; /* 1 part of the total height */
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 아이콘과 제목 사이에 공간 분배 */
  background-color: #f8f9fa;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  font-size: 24px; /* 아이콘 크기 조정 */
  color: #333; /* 아이콘 색상 */
  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const HomeIconStyled = styled(HomeIcon)`
  width: 24px; /* 아이콘 크기 조정 */
  height: 24px; /* 아이콘 크기 조정 */
`;

const SearchIconStyled = styled(SearchIcon)`
  width: 24px; /* 아이콘 크기 조정 */
  height: 24px; /* 아이콘 크기 조정 */
`;
