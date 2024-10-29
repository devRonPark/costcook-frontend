import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaStar } from 'react-icons/fa'; // 별 아이콘

// 레시피 평가(score), 리뷰 작성 컴포넌트
// 리뷰 테이블에 보낼 데이터 : user, recipe, score, comment

const RecipeEvaluation = ({ isLoggedIn, userScore, onSubmitScore }) => {
  const [score, setScore] = useState(userScore || 0);
  const [review, setReview] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tempScore, setTempScore] = useState(userScore || 0); // 임시 점수 (리뷰 취소 시 이전 점수로 돌아감)

  // 사용자가 클릭한 별의 순서 = 점수
  const handleStarClick = (index) => {
    setTempScore(index + 1); // 임시 점수 설정
      setModalIsOpen(true);
  };

  // 리뷰 제출 시 반영
  const handleSubmit = () => {
    setScore(tempScore); // 최종 점수 설정
    onSubmitScore(tempScore, review);
    setModalIsOpen(false);
  };

  // 리뷰 제출 취소
  const handleCancel = () => {
    setModalIsOpen(false);
    setReview(''); // 리뷰 내용 초기화
    setTempScore(score); // 리뷰 취소 시 이전 점수로 돌아감
  }


  
  return (
    <div style={{ position: 'relative', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      {/* {!isLoggedIn ? ( */}
      {/* 로그인 연동시 교체 */}
      {isLoggedIn ? ( // 로그인 되어있다고 가정
        <>
          <div style={{ filter: 'blur(3px)' }}>
            {Array(5).fill().map((_, index) => (
              <FaStar key={index} style={{ cursor: 'pointer', color: 'lightgray' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <p>로그인 한 유저만 평가할 수 있습니다</p>
            <button onClick={() => console.log('로그인 페이지로 이동')}>로그인</button>
          </div>
        </>
      ) : (
        <>
          {/* 사용자가 이미 평가한 경우 현재 평가 표시 */}
          <div>
            {Array(5).fill().map((_, index) => (
              <FaStar
                key={index}
                onClick={() => handleStarClick(index)}
                style={{ cursor: 'pointer', color: index < score ? 'gold' : 'lightgray' }}
              />
            ))}
          </div>          
        </>
      )}

      {/* 모달창 */}
      <Modal
        isOpen={modalIsOpen}
        // onRequestClose={() => setModalIsOpen(false)}
        onRequestClose={handleCancel}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: 'auto',
            borderRadius: '10px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 색
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>리뷰 작성</h3>
          <div style={{ marginLeft: '10px' }}>
            {Array(5).fill().map((_, index) => (
              <FaStar
                key={index}
                onClick={() => setTempScore(index + 1)} // 임시 점수
                style={{
                  cursor: 'pointer',
                  color: index < tempScore  ? 'gold' : 'lightgray',
                  fontSize: '20px', // 별 아이콘 크기 조정
                  marginRight: '2px'
                }}
              />
            ))}
          </div>
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
            resize: 'none', // 크기 조정 불가
            fontSize: '16px',
          }}
        />

        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleCancel} style={{
            width: '40%',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>취소</button>

          <button onClick={handleSubmit} style={{
            width: '40%',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>제출</button>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeEvaluation;
