import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/Auth/AuthContext';
import { useEffect, useRef, useState } from 'react';
import ImageDisplay from '../components/display/ImageDisplay';
import RoundedButton from '../components/common/Button/RoundedButton';
import AuthApi from '../services/auth.api';
import { toast } from 'react-toastify';
import { removeCookie } from '../utils/cookieUtil';
import UserProfile from '../components/UserProfile';
import PageContainer from '../components/layout/PageContainer';
import ProfileUpdateHeader from '../components/layout/Header/ProfileUpdateHeader';
import { COLORS, defaultImagePath, ingredients } from '../utils/constant';
import IngredientSelection from '../components/IngredientSelection';

const MyPage = () => {
  const {
    state: { user },
    dispatch,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('show');
  const [preferredSaveBtnActive, setPreferredSaveBtnActive] = useState(false);
  const [dislikedSaveBtnActive, setDislikedSaveBtnActive] = useState(false);

  const preferredIngredientsCopy = useRef(null);
  const dislikedIngredientsCopy = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await AuthApi.getMyInfo(); // 인증 상태를 확인하는 API 호출
        if (res.status === 200) {
          console.log(res.data);
          dispatch({
            type: 'GET_MY_INFO',
            payload: res.data, // 서버에서 받은 사용자 정보
          });
        }
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
      }
    };

    fetchUserInfo();
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

  const toggleTasteManagement = (e) => {
    const { name } = e.target;
    if (name === 'preferred') {
      setMode('editPreferredIngredients');
    } else if (name === 'disliked') {
      setMode('editDislikedIngredients');
    }
  };

  const handleUserTasteSave = async () => {
    const { preferredIngredients, dislikedIngredients } = user;

    const formData = new FormData();
    if (mode === 'editPreferredIngredients') {
      formData.append('preferredIngredients', preferredIngredients);
    } else if (mode === 'editDislikedIngredients') {
      formData.append('dislikedIngredients', dislikedIngredients);
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

  useEffect(() => {
    if (user) {
      // user.preferredIngredients 가 null이 아닌 경우만 값 저장
      if (
        user.preferredIngredients !== null &&
        preferredIngredientsCopy.current === null
      ) {
        preferredIngredientsCopy.current = JSON.stringify(
          [...user.preferredIngredients].sort()
        );
      }

      // user.dislikedIngredients 가 null이 아닌 경우만 값 저장
      if (
        user.dislikedIngredients !== null &&
        dislikedIngredientsCopy.current === null
      ) {
        dislikedIngredientsCopy.current = JSON.stringify(
          [...user.dislikedIngredients].sort()
        );
      }
    }
  }, [user]);

  useEffect(() => {
    if (
      mode === 'editPreferredIngredients' &&
      user &&
      preferredIngredientsCopy.current !== null
    ) {
      const hasChanged =
        JSON.stringify([...user.preferredIngredients].sort()) !==
        preferredIngredientsCopy.current;
      const isEmpty = user.preferredIngredients.length === 0;
      setPreferredSaveBtnActive(hasChanged && !isEmpty);
    } else if (
      mode === 'editDislikedIngredients' &&
      user &&
      dislikedIngredientsCopy.current !== null
    ) {
      const hasChanged =
        JSON.stringify([...user.dislikedIngredients].sort()) !==
        dislikedIngredientsCopy.current;
      const isEmpty = user.dislikedIngredients.length === 0;
      setDislikedSaveBtnActive(hasChanged && !isEmpty);
    }
  }, [user, mode]);

  const isSaveBtnActive =
    mode === 'editPreferredIngredients'
      ? preferredSaveBtnActive
      : dislikedSaveBtnActive;

  if (mode === 'editMyProfile') {
    return (
      <PageContainer>
        <ProfileUpdateHeader
          pageName="내 프로필"
          handleBack={handleProfileUpdateHeaderBack}
        />
        <UserProfile
          nickname={user?.nickname ?? ''}
          handleChange={handleChange}
          profileUrl={user?.profileUrl ?? defaultImagePath}
          handleFileChange={handleFileChange}
          onClick={handleProfileUpdate}
        />
      </PageContainer>
    );
  } else if (
    mode === 'editPreferredIngredients' ||
    mode === 'editDislikedIngredients'
  ) {
    return (
      <PageContainer>
        {/* 모드에 따라 페이지 렌더링 */}
        <ProfileUpdateHeader
          pageName={
            mode === 'editPreferredIngredients'
              ? '선호 재료 관리'
              : '비선호 재료 관리'
          }
          handleBack={handleProfileUpdateHeaderBack}
        />
        <IngredientSelection
          step={mode === 'editDislikedIngredients' ? 1 : 2}
          ingredients={ingredients}
          dislikedIngredients={
            user?.dislikedIngredients?.length > 0
              ? user?.dislikedIngredients
              : []
          }
          preferredIngredients={
            user?.preferredIngredients?.length > 0
              ? user?.preferredIngredients
              : []
          }
          handleChange={handleChange}
          margin="60px 0 0 0"
        />
        <ButtonContainer>
          <RoundedButton
            text="저장"
            onClick={handleUserTasteSave}
            backgroundColor="#FFDB58"
            hoverBackgroundColor="#FFD700"
            border="1px solid black"
            isDisabled={!isSaveBtnActive}
          />
        </ButtonContainer>
      </PageContainer>
    );
  }
  return (
    <Layout pageName="마이페이지">
      <DateContainer>
        <ProfileContainer>
          <ImageDisplay
            width="150px"
            height="150px"
            border="2px solid black"
            margin="20px 0"
            src={user?.profileUrl ?? defaultImagePath}
            altText={`${user?.id ?? ''} 번 회원 프로필 이미지`}
          />
          <ProfileNameContainer>{user?.nickname ?? ''}</ProfileNameContainer>
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
        <h4>
          <strong style={{ color: COLORS.PREFERRED.COLOR }}>
            좋아하는 재료
          </strong>
          를 추가하거나 수정할 수 있습니다
        </h4>
        <SettingButtonContainer>
          <Button
            name="preferred"
            onClick={(e) => toggleTasteManagement(e)}
            style={{ width: '100%', color: COLORS.PREFERRED.COLOR }}
          >
            선호 재료 관리
          </Button>
        </SettingButtonContainer>
      </SettingContainer>
      <SettingContainer>
        <h4>
          <strong style={{ color: COLORS.DISLIKED.COLOR }}>
            싫어하는 재료
          </strong>
          를 추가하거나 수정할 수 있습니다
        </h4>
        <SettingButtonContainer>
          <Button
            name="disliked"
            onClick={(e) => toggleTasteManagement(e)}
            style={{ width: '100%', color: COLORS.DISLIKED.COLOR }}
          >
            비선호 재료 관리
          </Button>
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
            <Link to="/budget-history">
              <Button>예산 관리</Button>
            </Link>
          </ButtonSplitBox>
          <ButtonSplitBox>
            <Link to="/my/reviews">
              <Button>내가 쓴 리뷰</Button>
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
  border: 1px black solid;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;

const ProfileContainer = styled.div`
  height: 290px;
  width: 45%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const ProfileNameContainer = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const DateButtonContainer = styled.div`
  height: 290px;
  width: 45%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const SettingContainer = styled.div`
  height: 100px;
  width: 100%;
  border: 1px black solid;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
`;
const SettingButtonContainer = styled.div`
  height: 30px;
  width: 100%;
  margin-top: 10px;
  border: 1px black solid;
  border-radius: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const ButtonLayoutContainer = styled.div`
  width: 100%;
  border: 1px black solid;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  height: 120px;
  width: 100%;
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
