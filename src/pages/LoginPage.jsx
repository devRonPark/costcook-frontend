import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // 카카오 아이콘
import GoogleIcon from '@mui/icons-material/Google'; // 구글 아이콘
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import startScreenImage from '../assets/images/start_screen_img.png';

const LoginPage = () => (
  <LoginContainer>
    <Image src={startScreenImage} alt="Welcome" />
    <Title>CostCook</Title>
    <ButtonContainer>
      <LoginButton
        variant="contained"
        sx={{ backgroundColor: '#FEE500', color: '#222' }}
        startIcon={<AccountCircleIcon />}
      >
        카카오로 로그인
      </LoginButton>
      <LoginButton
        variant="contained"
        color="secondary"
        startIcon={<GoogleIcon />}
      >
        구글로 로그인
      </LoginButton>
      <SkipButton variant="text">
        <Link to="/home">건너뛰기</Link>
      </SkipButton>
    </ButtonContainer>
  </LoginContainer>
);

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 화면 전체 높이 */
  max-width: 600px; /* 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  border: 1px solid #eaeaea; /* 테두리 추가 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 추가 */
  padding: 20px; /* 내부 여백 */
`;

const Image = styled.img`
  width: 200px; /* 이미지 크기 조정 */
  height: auto; /* 비율 유지 */
  margin-bottom: 20px; /* 이미지와 텍스트 간격 */
`;

const Title = styled.h1`
  font-size: 32px; /* 텍스트 크기 조정 */
  margin-bottom: 40px; /* 텍스트와 버튼 간격 */
`;

const ButtonContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column; /* 버튼을 세로로 배치 */
  gap: 16px; /* 버튼 간격 */
  margin-bottom: 20px; /* 버튼과 건너뛰기 버튼 간격 */
`;

const LoginButton = styled(Button)`
  margin: 0 auto !important;
  width: 100%; /* 버튼 너비를 80%로 설정 */
`;

const SkipButton = styled(Button)`
  width: auto; /* 버튼 너비를 자동으로 설정 */
  max-width: 100px; /* 텍스트에 맞는 최대 너비 설정 */
  margin-left: auto !important; /* 오른쪽 정렬 */
`;
