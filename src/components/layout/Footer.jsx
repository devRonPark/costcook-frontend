import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home'; // 홈 아이콘
import BookIcon from '@mui/icons-material/Book'; // 요리책 아이콘
import CalculateIcon from '@mui/icons-material/Calculate'; // 계산기 아이콘
import StarIcon from '@mui/icons-material/Star'; // 별 아이콘
import PersonIcon from '@mui/icons-material/Person'; // 사람 아이콘
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate(); // 페이지 전환을 위한 navigate 함수
  const location = useLocation(); // 현재 경로 정보를 가져옴

  // 경로를 변경하는 핸들러 함수
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <FooterContainer>
      <IconWrapper
        isActive={location.pathname === '/'}
        onClick={() => handleNavigate('/')}
      >
        <HomeIconStyled />
        <Text>홈</Text>
      </IconWrapper>
      <IconWrapper
        isActive={location.pathname === '/recipe'}
        onClick={() => handleNavigate('/recipe')}
      >
        <BookIconStyled />
        <Text>레시피</Text>
      </IconWrapper>
      <IconWrapper
        isActive={location.pathname === '/budget'}
        onClick={() => handleNavigate('/budget')}
      >
        <CalculateIconStyled />
        <Text>예산관리</Text>
      </IconWrapper>
      <IconWrapper
        isActive={location.pathname === '/favorite'}
        onClick={() => handleNavigate('/favorite')}
      >
        <StarIconStyled />
        <Text>즐겨찾기</Text>
      </IconWrapper>
      <IconWrapper
        isActive={location.pathname === '/my'}
        onClick={() => handleNavigate('/my')}
      >
        <PersonIconStyled />
        <Text>마이</Text>
      </IconWrapper>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: space-between; /* 각 아이콘 사이의 간격을 균등하게 */
  align-items: center;
  padding: 8px 0; /* 상하 패딩 추가 */
  background-color: #f8f9fa;
`;

const IconWrapper = styled.div`
  flex: 1; /* 각 아이콘이 동일한 비율을 차지하도록 설정 */
  cursor: pointer;
  font-size: 24px; /* 아이콘 크기 조정 */
  color: #333; /* 아이콘 색상 */
  text-align: center; /* 텍스트 가운데 정렬 */

  /* 현재 경로와 일치하면 색상 변경 */
  color: ${({ isActive }) => (isActive ? '#007bff' : '#333')};

  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const HomeIconStyled = styled(HomeIcon)`
  font-size: 22px; /* 아이콘 크기 조정 */
`;

const BookIconStyled = styled(BookIcon)`
  font-size: 22px; /* 아이콘 크기 조정 */
`;

const CalculateIconStyled = styled(CalculateIcon)`
  font-size: 22px; /* 아이콘 크기 조정 */
`;

const StarIconStyled = styled(StarIcon)`
  font-size: 22px; /* 아이콘 크기 조정 */
`;

const PersonIconStyled = styled(PersonIcon)`
  font-size: 22px; /* 아이콘 크기 조정 */
`;

const Text = styled.span`
  display: block; /* 텍스트를 블록으로 설정하여 아이콘 아래에 위치하도록 함 */
  font-size: 10px; /* 텍스트 크기 조정 */
  margin-top: 4px; /* 아이콘과 텍스트 사이의 간격 조정 */
`;
