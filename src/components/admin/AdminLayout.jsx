// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import FormHeader from './FormHeader';
import ExitModal from './ExitModal';

const AdminLayout = ({
  children,
  title,
  rightLabel,
  isRegisterEnabled,
  isModified,
  onSubmit,
  onBack, // 새로 추가된 prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 뒤로 가기 클릭 핸들러
  const handleBackClick = () => {
    if (isModified) {
      setIsModalOpen(true); // 변경사항이 있는 경우 모달 열기
    } else if (onBack) {
      onBack(); // 부모 컴포넌트에서 전달받은 동작 실행
    } else {
      window.history.back(); // 부모 컴포넌트에서 onBack이 전달되지 않은 경우 기본 동작으로 뒤로 가기
    }
  };

  // 모달에서 "예"를 클릭했을 때 동작
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (onBack) {
      onBack(); // 부모 컴포넌트에서 전달받은 동작 실행
    } else {
      window.history.back(); // 부모 컴포넌트에서 onBack이 전달되지 않은 경우 기본 동작으로 뒤로 가기
    }
  };

  // 모달에서 "아니요"를 클릭했을 때 동작
  const handleModalCancel = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <Container>
      <FixedHeader>
        <FormHeader
          title={title}
          rightLabel={rightLabel}
          isRegisterEnabled={isRegisterEnabled}
          onBackClick={handleBackClick}
          onSubmit={onSubmit} // 등록 버튼 클릭 시 호출할 함수 전달
        />
      </FixedHeader>
      <Content>{children}</Content>

      {/* ExitModal 컴포넌트 사용 */}
      <ExitModal
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </Container>
  );
};

export default AdminLayout;

// 스타일 컴포넌트 정의
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 8px;
  background-color: white;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  padding: 16px 0;
  background-color: #f8f9fa;
  z-index: 1000;
  border: 1px solid rgb(224, 224, 224);
  border-bottom: none;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;
