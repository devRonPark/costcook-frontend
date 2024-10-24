import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: flex-end; /* 아래에서 올라오도록 설정 */
  justify-content: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: 16px 16px 0 0; /* 모달의 위쪽 모서리만 둥글게 */
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slide-up 0.3s ease-in-out; /* 트랜지션 효과 추가 */

  &.slide-down {
    animation: slide-down 0.3s ease-in-out forwards; /* 닫힐 때 애니메이션 */
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-down {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
      opacity: 0; /* 사라지는 효과 추가 */
    }
  }

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem; /* 크기 증가 */
  font-weight: bold; /* 강조 */
  margin-bottom: 16px;
  text-align: center; /* 가운데 정렬 */
`;

const Description = styled.p`
  margin-bottom: 16px;
  text-align: center; /* 가운데 정렬 */
  color: #757575; /* 색상 변경 */
  font-size: 0.875rem; /* 크기 감소 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 버튼을 양쪽 끝으로 배치 */
  margin-top: 16px;
`;

const SaveButton = styled.button`
  flex: 1; /* 버튼의 너비를 동일하게 설정 */
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${({ disabled }) =>
    disabled ? '#e0e0e0' : '#2196f3'}; /* 비활성화 상태 색상 */
  color: ${({ disabled }) =>
    disabled ? '#9e9e9e' : 'white'}; /* 비활성화 상태 텍스트 색상 */
  cursor: ${({ disabled }) =>
    disabled ? 'not-allowed' : 'pointer'}; /* 비활성화 상태 커서 */

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? '#e0e0e0' : '#1e88e5'}; /* 비활성화 상태 호버 색상 */
  }
`;

const AgreementSection = styled.div`
  margin: 16px 0;
  text-align: center; /* 가운데 정렬 */
`;

const CloseButton = styled.button`
  position: absolute; /* 모달 상단 우측에 위치 */
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const UserConsentModal = ({
  personalInfoAgreement,
  setPersonalInfoAgreement,
  open,
  handleClose,
  handleUserInfoSave,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleSave = () => {
    // 서버로 정보 업데이트 요청
    // TODO: 서버 요청 로직 추가
    handleUserInfoSave();
    handleClose();
  };

  const handleModalClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      handleClose();
      setIsClosing(false);
    }, 300); // 애니메이션 지속 시간과 동일하게 설정
  };

  return (
    <StyledModal open={open} onClose={handleModalClose}>
      <ModalContent className={isClosing ? 'slide-down' : ''}>
        <CloseButton onClick={handleModalClose}>
          <CloseIcon />
        </CloseButton>
        <Title>개인정보 수집 및 이용 동의</Title>
        <Description>
          CostCook는 사용자 맞춤 레시피 추천을 위해 기피 재료, 선호 재료, 프로필
          이미지, 닉네임 등의 정보를 수집합니다. 동의하시면 서비스를 이용할 수
          있습니다.
        </Description>

        <AgreementSection>
          <FormControlLabel
            control={
              <Checkbox
                checked={personalInfoAgreement}
                onChange={(e) => setPersonalInfoAgreement(e.target.checked)}
                color="primary"
              />
            }
            label="개인정보 수집 및 이용 동의"
          />
        </AgreementSection>

        <ButtonContainer>
          <SaveButton onClick={handleSave} disabled={!personalInfoAgreement}>
            저장
          </SaveButton>
        </ButtonContainer>
      </ModalContent>
    </StyledModal>
  );
};

export default UserConsentModal;
