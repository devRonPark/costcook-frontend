import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home'; // MUI Home 아이콘
import SearchIcon from '@mui/icons-material/Search'; // MUI Search 아이콘
import { Link } from 'react-router-dom';
import BackButton from '../../common/Button/BackButton';

const LoginHeader = ({ text = '' }) => (
  <LoginHeaderContainer>
    <IconWrapper>
      <Link to="/">
        <BackButton />
      </Link>
    </IconWrapper>
    <HeaderText>{text}</HeaderText>
    <IconWrapper>
      <SearchIconStyled />
    </IconWrapper>
  </LoginHeaderContainer>
);

export default LoginHeader;

const LoginHeaderContainer = styled.header`
  box-sizing: border-box;
  height: 65px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  background-color: #f8f9fa;
`;

const HeaderText = styled.h2`
  width: 100%;
  text-align: center;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  font-size: 32px; /* 아이콘 크기 조정 */
  color: #333; /* 아이콘 색상 */
  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const SearchIconStyled = styled(SearchIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important;
  visibility: hidden;
`;
