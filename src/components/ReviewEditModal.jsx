import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Star, StarOutline } from '@mui/icons-material';

const ReviewEditModal = ({
  review,
  isOpen,
  onChange,
  onClose,
  onSubmit,
  isEditMode,
}) => {
  // 평점 설정 및 초기화
  const handleStarClick = (index) => {
    const newScore = review.score === index + 1 ? 0 : index + 1;
    onChange('score', newScore);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle style={{ textAlign: 'center' }}>
        {isEditMode ? '리뷰 수정' : '리뷰 작성'}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
            width: '300px',
          }}
        >
          {Array(5)
            .fill()
            .map((_, index) => {
              const isFilled = index < review.score;
              return (
                <span
                  key={index}
                  onClick={() => handleStarClick(index)}
                  style={{ cursor: 'pointer', marginRight: '2px' }}
                >
                  {isFilled ? (
                    <Star style={{ color: 'gold', fontSize: '24px' }} />
                  ) : (
                    <StarOutline style={{ color: 'gold', fontSize: '24px' }} />
                  )}
                </span>
              );
            })}
        </div>
        <textarea
          type="text"
          value={review.comment}
          onChange={(e) => onChange('comment', e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ced4da',
            marginBottom: '10px',
          }}
          placeholder="리뷰를 작성해주세요."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          취소
        </Button>
        <Button onClick={onSubmit} color="primary" variant="contained">
          {isEditMode ? '수정' : '등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewEditModal;
