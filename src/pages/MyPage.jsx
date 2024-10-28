import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/Auth/AuthContext';
import { useEffect, useState } from 'react';
import ImageDisplay from '../components/display/ImageDisplay';
import RoundedButton from '../components/common/Button/RoundedButton';
import AuthApi from '../services/auth.api';
import { toast } from 'react-toastify';
import { removeCookie } from '../utils/cookieUtil';
import UserProfile from '../components/UserProfile';
import PageContainer from '../components/layout/PageContainer';
import ProfileUpdateHeader from '../components/layout/Header/ProfileUpdateHeader';
import { defaultImagePath } from '../utils/constant';

const MyPage = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('show');

  // 현재 로그인한 사용자 정보 조회
  useEffect(() => {
    async function fetchMyInfo() {
      try {
        const res = await AuthApi.getMyInfo();
        if (res.status === 200) {
          console.log(res.data);
          // user 전역 state 업데이트
          dispatch({
            type: 'SET_MY_INFO',
            payload: res.data,
          });
        }
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
      }
    }

    fetchMyInfo();
  }, []);

  const handleChange = (field, value) =>
    dispatch({ type: 'UPDATE_MY_INFO', payload: { field, value } });

  // 로그아웃 버튼 핸들러
  const handleLogoutBtnClick = async () => {
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

  // 프로필 업데이트 화면 렌더링
  const handleProfileUpdateBtnClick = () => {
    setMode('editMyProfile');
  };

  // 프로필 업데이트 화면에서 뒤로가기 버튼 클릭
  const handleProfileUpdateHeaderBack = () => {
    setMode('show');
  };

  const handleProfileUpdate = async () => {
    const { nickname, profileFile } = state.user;
    const formData = new FormData();
    formData.append('nickname', nickname);
    if (profileFile) {
      formData.append('profileImage', profileFile);
    }
    try {
      const response = await AuthApi.updateMyInfo(formData);

      if (response.status === 200) {
        toast.info('회원 정보가 성공적으로 업데이트되었습니다!');

        // 마이 페이지로 이동.
        setMode('show');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      toast.error(
        '회원 정보 업데이트에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  // 파일 변경 시 호출
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profileUrl', reader.result); // 이미지 미리보기 업데이트
        handleChange('profileFile', file); // 파일 객체 저장
      };
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  };

  if (mode === 'editMyProfile') {
    return (
      <PageContainer>
        <ProfileUpdateHeader handleBack={handleProfileUpdateHeaderBack} />
        <UserProfile
          nickname={state.user?.nickname ?? ''}
          handleChange={handleChange}
          profileUrl={state.user?.profileUrl ?? defaultImagePath}
          handleFileChange={handleFileChange}
          onClick={handleProfileUpdate}
        />
      </PageContainer>
    );
  }
  return (
    <Layout pageName="마이페이지">
      <DateContainer>
        <ProfileContainer>
          <ImageDisplay
            width="200px"
            height="200px"
            src={state.user?.profileUrl ?? defaultImagePath}
            altText={`${state?.user?.id ?? ''} 번 회원 프로필 이미지`}
            margin="20px 0"
          />
          <ProfileNameContainer>
            {state.user?.nickname ?? ''}
          </ProfileNameContainer>
        </ProfileContainer>
        <DateButtonContainer>
          <RoundedButton
            text="프로필 변경"
            onClick={handleProfileUpdateBtnClick}
            width="100%"
          />
          <RoundedButton
            text="로그아웃"
            onClick={handleLogoutBtnClick}
            width="100%"
          />
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
