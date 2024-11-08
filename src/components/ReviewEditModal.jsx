import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
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
  const [error, setError] = useState({ score: false, comment: false });

  // 평점 설정 및 초기화
  const handleStarClick = (index) => {
    const newScore = review.score === index + 1 ? 0 : index + 1;
    onChange('score', newScore);
  };

  // 유효성 검사 함수
  const validate = () => {
    const newError = {
      score: review.score === 0,
      comment: review.comment.trim().length < 3,
    };
    setError(newError);
    return !newError.score && !newError.comment;
  };

  // 제출 버튼 클릭 시 유효성 검사를 수행
  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  // review 값이 변경될 때마다 유효성 검사를 자동으로 수행
  useEffect(() => {
    validate();
  }, [review]);

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
        {error.score && (
          <Typography color="error" variant="body2" align="center">
            평점을 선택해주세요.
          </Typography>
        )}
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
        {error.comment && (
          <Typography color="error" variant="body2">
            리뷰는 3글자 이상 작성해주세요.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!review.score || review.comment.trim().length < 3}
        >
          {isEditMode ? '수정' : '등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewEditModal;
