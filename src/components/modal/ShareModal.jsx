import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.info('링크가 복사되었습니다!');
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <Title>공유하기</Title>
        <LinkContainer>
          <ShareLink readOnly value={shareUrl} />
          <CopyButton onClick={handleCopyLink}>복사</CopyButton>
        </LinkContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ShareModal;

// 스타일 정의
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 300px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  &:hover {
    color: #000;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
`;

const ShareLink = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: none;
  outline: none;
`;

const CopyButton = styled.button`
  padding: 10px;
  background-color: #0073e6;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #005bb5;
  }
`;
