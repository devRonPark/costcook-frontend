import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const ReviewDetailModal = ({ review, onClose }) => {
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
    console.log('차단 상태 변경 요청');
    // 여기에 서버와 통신하는 코드나 상태 변경 로직을 추가하면 됩니다.
  };

  const isUpdated = review.createdAt !== review.updatedAt;

  let dateSection;

  if (!isUpdated && !review.deletedAt) {
    // 수정되지 않고 삭제되지 않은 경우에 Row 형식으로 작성일만 간단히 표시한다.
    dateSection = (
      <Row>
        <Label>작성일</Label>
        <Value>{formatDate(review.createdAt)}</Value>
      </Row>
    );
  } else {
    // 수정되었거나 삭제된 경우에 DateContainer 형식으로 여러 날짜를 표시한다.
    dateSection = (
      <DateContainer>
        <DateItem style={{ marginTop: '16px' }}>
          <DateLabel>작성일</DateLabel>
          <DateValue>{formatDate(review.createdAt)}</DateValue>
        </DateItem>
        {isUpdated && (
          <DateItem>
            <DateLabel>수정일</DateLabel>
            <DateValue>{formatDate(review.updatedAt)}</DateValue>
          </DateItem>
        )}
        {review.deletedAt && (
          <DateItem>
            <DateLabel>삭제일</DateLabel>
            <DateValue>{formatDate(review.deletedAt)}</DateValue>
          </DateItem>
        )}
      </DateContainer>
    );
  }

  return (
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
        {/* 날짜 관련 섹션 렌더링 */}
        {dateSection}
        <Divider />
        <ModalFooter>
          <BlockButton status={review.status} onClick={handleReviewBlock}>
            {review.status ? '차단 해제' : '차단하기'}
          </BlockButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
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
  margin-top: 16px;
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