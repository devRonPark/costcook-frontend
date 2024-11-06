import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';
import apiClient from '../../services/api';

const ReviewDetailModal = ({ review, onClose, onStatusChange  }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(review);

  if (!review) return null;

  const renderStars = (rating) => {
    const totalStars = 5;
    return [...Array(totalStars)].map((_, index) => (
      <FaStar
        key={index}
        color={index < rating ? '#ffc107' : '#e4e5e9'}
        size={20}
        style={{ marginRight: '2px' }}
      />
    ));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm:ss');
  };

  const handleReviewBlock = () => {
    setIsConfirmModalOpen(true); // 확인 모달을 열기
  };

  const handleConfirm = async (confirmed) => {
    setIsConfirmModalOpen(false); // 모달 닫기
    if (confirmed) {
      try {
        const response = await apiClient.patch(`/admin/reviews/${currentReview.id}/status`);
        if (response.status === 200) {
          // 서버 응답이 성공적이면 로컬 상태 업데이트
          setCurrentReview((prevReview) => ({
            ...prevReview,
            status: !prevReview.status, // 기존 상태를 반전
          }));
          onStatusChange(currentReview.id, !currentReview.status);

          
        }
      } catch (error) {
        console.error('차단 상태 변경 중 오류 발생:', error);
      }
    }
  };
  

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Row>
            <Label>레시피</Label>
            <Value>{review.recipe.title}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>작성자</Label>
            <Value>{review.user.nickname}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>평점</Label>
            <Value>{renderStars(review.score)}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>댓글</Label>
            <Value>{review.comment}</Value>
          </Row>
          <Divider />
          <DateContainer>
            <DateItem style={{ marginTop: '16px' }}>
              <DateLabel>작성일</DateLabel>
              <DateValue>{formatDate(review.createdAt)}</DateValue>
            </DateItem>
            <DateItem>
              <DateLabel>수정일</DateLabel>
              <DateValue>{formatDate(review.updatedAt)}</DateValue>
            </DateItem>
          </DateContainer>
          <Divider />
          <ModalFooter>
            <BlockButton status={currentReview.status} onClick={handleReviewBlock}>
              {currentReview.status ? '차단 해제' : '차단하기'}
            </BlockButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>

      {/* 커스텀 확인 모달 */}
      {isConfirmModalOpen && (
        <ConfirmModalOverlay>
          <ConfirmModalContent>
            <ConfirmMessage>
              {review.status ? '차단 해제하시겠습니까?' : '정말 차단하시겠습니까?'}
            </ConfirmMessage>
            <ConfirmActions>
              <ConfirmButton onClick={() => handleConfirm(true)}>확인</ConfirmButton>
              <CancelButton onClick={() => handleConfirm(false)}>취소</CancelButton>
            </ConfirmActions>
          </ConfirmModalContent>
        </ConfirmModalOverlay>
      )}
    </>
  );
};

export default ReviewDetailModal;

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
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  padding: 12px;
  transition: color 0.3s;

  &:hover {
    color: #ff0000;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #333;
`;

const Divider = styled.div`
  border-top: 1px solid #ddd;
  margin: 8px 0;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0 24px;
`;

const DateItem = styled.div`
  display: flex;
  align-items: center;
`;

const DateLabel = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  color: #444;
  margin-right: 16px;
`;

const DateValue = styled.div`
  font-size: 0.9rem;
  color: #333;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const BlockButton = styled.button`
  background-color: ${(props) => (props.status ? '#4CAF50' : '#FF4444')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.status ? '#388E3C' : '#D32F2F')};
  }
`;

// 커스텀 확인 모달 스타일 정의

const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ConfirmModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 320px; 
  max-width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ConfirmMessage = styled.p`
  font-size: 1.2rem; 
  color: #333;
  margin-bottom: 32px;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: space-evenly; 
  gap: 15px;
`;

const ConfirmButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 1rem; 
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 12px 24px; 
  font-size: 1rem; 
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #aaa;
  }
`;