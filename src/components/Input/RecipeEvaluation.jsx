import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
// import { FaStar } from 'react-icons/fa';

const RecipeEvaluation = ({ isLoggedIn, userScore, onSubmitScore }) => {
  const [score, setScore] = useState(userScore || 0);
  const [review, setReview] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tempScore, setTempScore] = useState(userScore || 0);

  const handleStarClick = (index) => {
    setTempScore(index + 1);
    setModalIsOpen(true);
  };

  const handleSubmit = () => {
    setScore(tempScore);
    onSubmitScore(tempScore, review);
    setModalIsOpen(false);
  };

  const handleCancel = () => {
    setModalIsOpen(false);
    setReview('');
    setTempScore(score);
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* 로그인 했다고 가정 */}
      {/* (로그인 연동 후 !isLoggedIn 으로 바꾸기) */}
      {isLoggedIn ? (
        <>
          <div style={{ filter: 'blur(3px)' }}>
            {Array(5)
              .fill()
              .map((_, index) => (
                <FaStar
                  key={index}
                  style={{ cursor: 'pointer', color: 'lightgray' }}
                />
              ))}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <p>로그인 한 유저만 평가할 수 있습니다</p>
            <button onClick={() => console.log('로그인 페이지로 이동')}>
              로그인
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            {Array(5)
              .fill()
              .map((_, index) => (
                <div>별</div>
                // <FaStar
                //   key={index}
                //   onClick={() => handleStarClick(index)}
                //   style={{
                //     cursor: 'pointer',
                //     color: index < score ? 'gold' : 'lightgray',
                //   }}
                // />
              ))}
          </div>
        </>
      )}

      <Dialog open={modalIsOpen} onClose={handleCancel}>
        <DialogTitle style={{ textAlign: 'center' }}>리뷰 작성</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px',
              width: '300px',
            }}
          >
            {Array(5)
              .fill()
              .map((_, index) => (
                <div>별</div>
                // <FaStar
                //   key={index}
                //   onClick={() => setTempScore(index + 1)}
                //   style={{
                //     cursor: 'pointer',
                //     color: index < tempScore ? 'gold' : 'lightgray',
                //     fontSize: '20px',
                //     marginRight: '2px',
                //   }}
                // />
              ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="리뷰를 작성하세요."
            rows="6"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid lightgray',
              resize: 'none',
              fontSize: '16px',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary" variant="contained">
            취소
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            제출
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecipeEvaluation;
