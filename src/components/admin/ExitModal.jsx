// src/components/common/ExitModal.jsx
import React from 'react';
import styled from 'styled-components';

const ExitModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null; // 모달이 열려 있지 않으면 렌더링하지 않음
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>변경사항이 있습니다. 정말로 나가시겠습니까?</ModalText>
        <ModalButtons>
          <ModalButton onClick={onConfirm} primary>
            예
          </ModalButton>
          <ModalButton onClick={onCancel}>아니요</ModalButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExitModal;

// 스타일 컴포넌트 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px; /* padding을 더 크게 해서 모양을 더 예쁘게 */
  border-radius: 12px; /* 더 부드러운 모서리 */
  width: 525px; /* 모달의 너비를 조금 늘려 시각적으로 더 안정감 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalText = styled.p`
  margin-bottom: 24px;
  font-size: 1.2rem;
  color: #333;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px; /* 버튼 사이의 간격을 좀 더 넓게 */
`;

const ModalButton = styled.button`
  padding: 16px 32px; /* 버튼 크기 증가 */
  font-size: 1.1rem; /* 버튼 텍스트 크기 증가 */
  border: none;
  border-radius: 8px; /* 버튼 모서리 둥글게 */
  cursor: pointer;
  background-color: ${(props) => (props.primary ? '#007bff' : '#aaa')};
  color: white;
  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#888')};
  }
`;
