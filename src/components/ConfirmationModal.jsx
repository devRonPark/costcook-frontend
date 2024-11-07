import { Button } from '@mui/material';
import styled from 'styled-components';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onClose} color="primary">
            취소
          </Button>
          <Button onClick={onConfirm} color="primary">
            확인
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 20px; // 메시지와 버튼 간 간격 조정
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;
