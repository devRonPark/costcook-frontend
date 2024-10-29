import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import StepIndicator from '../components/display/StepIndicator';
import UserProfile from '../components/UserProfile';
import NextButton from '../components/common/Button/NextButton';
import IngredientSelection from '../components/IngredientSelection';
import ProfileUpdateHeader from '../components/layout/Header/ProfileUpdateHeader';
import UserConsentModal from '../components/UserConsentModal';
import AuthApi from '../services/auth.api';
import { useNavigate } from 'react-router-dom';
import { defaultImagePath, ingredients } from '../utils/constant';
import { useAuth } from '../context/Auth/AuthContext';

const ButtonContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
`;

const ProfileUpdate = () => {
  const {
    state: { user },
    dispatch,
  } = useAuth();
  const [step, setStep] = useState(1); // 현재 step 관리

  const [personalInfoAgreement, setPersonalInfoAgreement] = useState(false); // 개인정보 수집 및 이용 동의 여부
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) =>
    dispatch({ type: 'UPDATE_MY_INFO', payload: { field, value } });
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

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  // 이 메소드는 UserConsentModal 컴포넌트의 props 로 전달되어 저장 버튼 클릭 시 호출된다.
  const handleUserInfoSave = async () => {
    const { nickname, profileFile, dislikedIngredients, preferredIngredients } =
      user;
    const formData = new FormData();
    formData.append('nickname', nickname);
    if (profileFile) {
      formData.append('profileImage', profileFile);
    }
    formData.append('preferredIngredients', preferredIngredients);
    formData.append('dislikedIngredients', dislikedIngredients);
    formData.append('personalInfoAgreement', personalInfoAgreement);
    try {
      const response = await AuthApi.updateMyInfo(formData);

      if (response.status === 200) {
        toast.info('회원 정보가 성공적으로 업데이트되었습니다!');

        // 회원가입 완료 페이지로 이동.
        navigate('/signup/complete');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      toast.error(
        '회원 정보 업데이트에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  // 선택 상태에 따라 다음 버튼 활성화 여부
  const isNextButtonDisabled = () => {
    if (step === 1) {
      return user?.dislikedIngredients.length === 0; // 기피 재료 체크 추가
    }
    if (step === 2) {
      return user?.preferredIngredients.length === 0; // 선호 재료 체크
    }
    return false; // 기본값
  };

  const renderStep = () => {
    if (step === 1 || step === 2) {
      return (
        <>
          <IngredientSelection
            ingredients={ingredients}
            preferredIngredients={
              user?.preferredIngredients?.length > 0
                ? user.preferredIngredients
                : []
            }
            dislikedIngredients={
              user?.dislikedIngredients?.length > 0
                ? user.dislikedIngredients
                : []
            }
            handleChange={handleChange}
            step={step}
            setStep={setStep}
          />
          <ButtonContainer>
            {/* NextSkipButtons 컴포넌트를 currentStep에 따라 렌더링 */}
            <NextButton
              onNext={handleNextStep}
              isNextDisabled={isNextButtonDisabled()}
            />
          </ButtonContainer>
        </>
      );
    }
    return (
      <>
        <UserProfile
          nickname={user?.nickname ?? ''}
          handleChange={handleChange}
          profileUrl={user?.profileUrl ?? ''}
          handleFileChange={handleFileChange}
          onClick={handleOpen}
        />
      </>
    );
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', minHeight: '100vh', margin: '0 auto' }}>
      <ProfileUpdateHeader
        pageName="프로필 업데이트"
        step={step}
        handleBack={handleBack}
      />
      {/* 여기서 쓰이는 헤더에는 뒤로 가기 버튼이 존재하는데 step 이 2, 3 일 때만 화면에 보여진다. 뒤로가기 버튼 클릭 시, step이 2인 화면이라면 step이 1인 화면으로 이동. step이 3인 홤녀이라면 step이 2인 화면으로 이동. */}
      <StepIndicator currentStep={step} totalSteps={3} />

      {renderStep()}

      {modalOpen && (
        <UserConsentModal
          personalInfoAgreement={personalInfoAgreement}
          setPersonalInfoAgreement={setPersonalInfoAgreement}
          open={modalOpen}
          handleClose={handleClose}
          handleUserInfoSave={handleUserInfoSave}
        />
      )}
    </div>
  );
};

export default ProfileUpdate;
