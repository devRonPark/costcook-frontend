import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/Auth/AuthContext';
import { useEffect } from 'react';
import ImageDisplay from '../components/display/ImageDisplay';
import RoundedButton from '../components/common/Button/RoundedButton';
import AuthApi from '../services/auth.api';
import { toast } from 'react-toastify';
import { removeCookie } from '../utils/cookieUtil';

const MyPage = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await AuthApi.logout(); // 로그아웃 API 호출
      if (res.status === 200) {
        dispatch({
          type: 'LOGOUT', // 사용자 state 제거
        });

        // accessToken 쿠키 제거
        removeCookie('accessToken');

        toast.info('로그아웃되었습니다.'); // 로그아웃 성공 메시지

        navigate('/home'); // 홈 화면으로 이동
      }
    } catch (error) {
      toast.error('잠시 후 다시 시도해주세요.'); // 에러 발생 시 오류 메시지 표시
    }
  };

  return (
    <Layout pageName="마이페이지">
      <DateContainer>
        <ProfileContainer>
          <ImageDisplay
            width="200px"
            height="200px"
            src={state?.user?.profileUrl ?? null}
            alt={`${state?.user?.id ?? ''} 번 회원 프로필 이미지`}
            margin="20px 0"
          />
          <ProfileNameContainer>요리하는 잉규형</ProfileNameContainer>
        </ProfileContainer>
        <DateButtonContainer>
          <RoundedButton
            text="프로필 변경"
            onClick={() => alert('프로필 변경 컴포넌트 렌더링')}
            width="100%"
          />
          <RoundedButton text="로그아웃" onClick={handleLogout} width="100%" />
        </DateButtonContainer>
      </DateContainer>
      <SettingContainer>
        <h4>좋아하는 재료를 추가하거나 수정 할 수 있습니다</h4>
        <SettingButtonContainer>
          <Link to="../list">
            <Button>선호 재료 관리</Button>
          </Link>
        </SettingButtonContainer>
      </SettingContainer>
      <SettingContainer>
        <h4>싫어하는 재료를 추가하거나 수정 할 수 있습니다</h4>
        <SettingButtonContainer>
          <Button>비선호 재료 관리</Button>
        </SettingButtonContainer>
      </SettingContainer>
      <ButtonLayoutContainer>
        <ButtonContainer>
          <Link to="../activities">
            <Button>내 활동</Button>
          </Link>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonSplitBox>
            <Link to="../budget">
              <Button>예산 관리</Button>
            </Link>
          </ButtonSplitBox>
          <ButtonSplitBox>
            <Link to="../review">
              <Button>리뷰 관리</Button>
            </Link>
          </ButtonSplitBox>
        </ButtonContainer>
      </ButtonLayoutContainer>
    </Layout>
  );
};

export default MyPage;

const DateContainer = styled.div`
  height: 300px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;

const ProfileContainer = styled.div`
  height: 290px;
  width: 45%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const ProfileImageContainer = styled.div`
  height: 200px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const ProfileNameContainer = styled.div`
  height: 60px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const DateButtonContainer = styled.div`
  height: 290px;
  width: 45%;
  border: 1px black solid;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const DateButton = styled.div`
  height: 60px;
  width: 90%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const SettingContainer = styled.div`
  height: 100px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;
const SettingButtonContainer = styled.div`
  height: 30px;
  width: 100%;
  margin-top: 10px;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const ButtonLayoutContainer = styled.div`
  height: 290px;
  width: 100%;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const ButtonContainer = styled.div`
  height: 120px;
  width: 100%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const ButtonSplitBox = styled.div`
  height: 120px;
  width: 50%;
  border: 1px black solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
