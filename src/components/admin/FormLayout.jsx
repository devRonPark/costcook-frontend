// src/components/admin/FormHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormHeader = ({ title, actionLabel, isRegisterEnabled, backPath, onSubmit, afterSubmitPath }) => {
  const navigate = useNavigate();

  // 뒤로 가기 버튼 핸들러
  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath); // 전달받은 경로로 이동
    } else {
      window.history.back(); // backPath가 없으면 기본적으로 뒤로 가기 동작
    }
  };

  // 오른쪽 버튼 핸들러 (등록/저장 등 액션)
  const handleActionClick = async () => {
    if (isRegisterEnabled && onSubmit) {
      await onSubmit(); // 폼 제출 동작 수행

      // 제출 후 특정 경로로 이동
      if (afterSubmitPath) {
        navigate(afterSubmitPath); // 제출 후 설정된 경로로 이동
      }
    }
  };

  return (
    <HeaderContainer>
      <IconWrapper onClick={handleBackClick}>
        <ArrowBackIconStyled />
      </IconWrapper>
      <Title>{title}</Title>
      {actionLabel && (
        <ActionWrapper>
          <ActionLabel
            isEnabled={isRegisterEnabled}
            onClick={handleActionClick}
          >
            {actionLabel}
          </ActionLabel>
        </ActionWrapper>
      )}
    </HeaderContainer>
  );
};

export default FormHeader;

// 스타일 컴포넌트 정의
const HeaderContainer = styled.header`
  box-sizing: border-box;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  height: 64px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  color: #333;
  &:hover {
    color: #007bff;
  }
`;

const ArrowBackIconStyled = styled(ArrowBackIcon)`
  width: 24px;
  height: 24px;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActionLabel = styled.span`
  margin-right: 16px;
  font-size: 1rem;
  color: ${(props) => (props.isEnabled ? '#007bff' : '#aaa')};
  cursor: ${(props) => (props.isEnabled ? 'pointer' : 'not-allowed')};
  font-weight: bold;
`;
