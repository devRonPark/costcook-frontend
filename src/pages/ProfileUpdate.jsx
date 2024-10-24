import { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import StepIndicator from '../components/display/StepIndicator';
import UserProfile from '../components/UserProfile';
import NextButton from '../components/common/Button/NextButton';
import IngredientSelection from '../components/IngredientSelection';
import ProfileUpdateHeader from '../components/layout/Header/ProfileUpdateHeader';
import RoundedButton from '../components/common/Button/RoundedButton';
import UserConsentModal from '../components/UserConsentModal';
import apiClient from '../services/api';
import AuthApi from '../services/auth.api';
import { useNavigate } from 'react-router-dom';

const ButtonContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
`;

// 기본 이미지 경로 설정
const defaultImagePath = `${
  import.meta.env.VITE_PUBLIC_URL
}/default_user_profile.png`;

// 화면에 렌더링되는 재료 정보
const ingredients = [
  {
    id: 28,
    name: '소고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_beef.png`,
  },
  {
    id: 11,
    name: '돼지고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_pork.png`,
  },
  {
    id: 3,
    name: '닭고기',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_chicken.png`,
  },
  {
    id: 5,
    name: '건어물류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_dried_fish.png`,
  },
  {
    id: 13,
    name: '과일류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_fruit.png`,
  },
  {
    id: 29,
    name: '버섯류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_mushroom.png`,
  },
  {
    id: 7,
    name: '곡류',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_rice.png`,
  },
  {
    id: 12,
    name: '달걀/유제품',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_dairy.png`,
  },

  {
    id: 4,
    name: '밀가루',
    imageUrl: `${import.meta.env.VITE_PUBLIC_URL}/category_flour.png`,
  },
];

const ProfileUpdate = () => {
  const [step, setStep] = useState(1); // 현재 step 관리
  const [userTaste, setUserTaste] = useState({
    // 사용자 취향 관리
    preferences: [],
    dislikedIngredients: [],
  });
  const [nickname, setNickname] = useState(''); // 사용자 닉네임
  const [profileImage, setProfileImage] = useState(defaultImagePath); // 사용자 프로필 이미지
  const [profileFile, setProfileFile] = useState(null); // 전송할 파일 객체 정보 관리
  const [personalInfoAgreement, setPersonalInfoAgreement] = useState(false); // 개인정보 수집 및 이용 동의 여부
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 선택한 파일 가져오기
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // 이미지 미리보기 업데이트
      };
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
      setProfileFile(file); // 파일을 상태로 저장
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
    console.log('저장 버튼 클릭 > 사용자 업데이트 동작 실행');
    const formData = new FormData();
    formData.append('nickname', nickname);
    if (profileFile) {
      formData.append('profileImage', profileFile);
    }
    formData.append(
      'preferences',
      userTaste.preferences.map((i) => i.id)
    );
    formData.append(
      'dislikedIngredients',
      userTaste.dislikedIngredients.map((i) => i.id)
    );
    formData.append('personalInfoAgreement', personalInfoAgreement);
    console.log('요청 바디에 담을 데이터 객체화 완료');
    try {
      console.log('사용자 정보 업데이트 서버로 요청');
      const response = await AuthApi.updateMyInfo(formData);

      if (response.status === 200) {
        toast.info('회원 정보가 성공적으로 업데이트되었습니다!');

        // 회원가입 완료 페이지로 이동.
        navigate('/signup/complete');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      toast.error('회원 정보 업데이트에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 선택 상태에 따라 다음 버튼 활성화 여부
  const isNextButtonDisabled = () => {
    if (step === 1) {
      return userTaste.dislikedIngredients.length === 0; // 기피 재료 체크 추가
    }
    if (step === 2) {
      return userTaste.preferences.length === 0; // 선호 재료 체크
    }
    return false; // 기본값
  };

  const renderStep = () => {
    if (step === 1 || step === 2) {
      return (
        <IngredientSelection
          ingredients={ingredients}
          userTaste={userTaste}
          setUserTaste={setUserTaste}
          step={step}
          setStep={setStep}
        />
      );
    }
    return (
      <UserProfile
        nickname={nickname}
        setNickname={setNickname}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        handleFileChange={handleFileChange}
      />
    );
  };

  return (
    <div style={{ maxWidth: '600px', minHeight: '100vh', margin: '0 auto' }}>
      <ProfileUpdateHeader step={step} setStep={setStep} />
      {/* 여기서 쓰이는 헤더에는 뒤로 가기 버튼이 존재하는데 step 이 2, 3 일 때만 화면에 보여진다. 뒤로가기 버튼 클릭 시, step이 2인 화면이라면 step이 1인 화면으로 이동. step이 3인 홤녀이라면 step이 2인 화면으로 이동. */}
      <StepIndicator currentStep={step} totalSteps={3} />

      {renderStep()}

      <ButtonContainer>
        {/* NextSkipButtons 컴포넌트를 currentStep에 따라 렌더링 */}
        {(step === 1 || step === 2) && (
          <NextButton
            onNext={handleNextStep}
            isNextDisabled={isNextButtonDisabled()}
          />
        )}

        {/* 저장 버튼 클릭 시, 서비스 이용동의 및 개인정보 수집동의 모달 화면이 아래에서 위로 올라온다.  */}
        {step === 3 && <RoundedButton text="저장" onClick={handleOpen} />}
      </ButtonContainer>

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
