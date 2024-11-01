// import React, { useState } from 'react';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';
// import { Star } from '@mui/icons-material';

// // 레시피 상세페이지 > 리뷰 등록에 대한 상태 제어.

// const RecipeEvaluation = ({ setRecipeList, recipeId, isLoggedIn }) => {
//   const [review, setReview] = useState({
//     score: 0,
//     comment: '',
//   });
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 리뷰 모달
//   const [userReview, setUserReview] = useState(null); // 사용자의 리뷰
//   const navigate = useNavigate();

//   const handleChange = (field, value) => {
//     setReview((prev) => ({ ...prev, [field]: value }));
//   };

//   // 점수 클릭 핸들러
//   const handleStarClick = (index) => {
//     // 비 로그인 유저 -> 로그인 유도
//     if (!isLoggedIn) {
//       setIsLoginModalOpen(true);
//     } else {
//       // 로그인 유저
//       handleChange('score', index + 1);
//       setIsReviewModalOpen(true);
//     }
//   };

//   // 로그인 페이지로 이동
//   const handleConfirmLogin = () => {
//     navigate('/login');
//   };

//   // 모달 닫기
//   // 로그인 모달 닫기
//   const handleCloseLoginModal = () => {
//     setIsLoginModalOpen(false);
//   };
//   // 리뷰 모달 닫기
//   const handleCloseReviewModal = () => {
//     setIsReviewModalOpen(false);
//     setReview({ score: 0, comment: '' });
//   };

//   // 리뷰 제출
//   const handleReviewSubmit = async () => {
//     try {
//       const form = {
//         recipeId: recipeId,
//         ...review,
//       };
//       console.log(form);
//       const res = await reviewAPI.createReview(form);
//       if (res.status === 201) {
//         // 리뷰 등록 API 성공 응답: { review: ReviewResponse }
//         // 리뷰 목록 state 에 추가.
//         // setRecipeList((prev) => [res.data.review, ...prev]);
//         setIsReviewModalOpen(false); // 모달 닫기
//       } else {
//         console.error('리뷰 작성 실패');
//       }
//     } catch (error) {
//       console.error('리뷰 작성 오류:', error);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: 'relative',
//         padding: '20px',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//       }}
//     >
//       {/* 로그인 했다고 가정 */}
//       {/* (로그인 연동 후 !isLoggedIn 으로 바꾸기) */}
//       {isLoggedIn ? (
//         <>
//           <div style={{ filter: 'blur(3px)' }}>
//             {Array(5)
//               .fill()
//               .map((_, index) => (
//                 <Star
//                   key={index}
//                   style={{ cursor: 'pointer', color: 'lightgray' }}
//                 />
//               ))}
//           </div>
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               textAlign: 'center',
//             }}
//           >
//             <p>로그인 한 유저만 평가할 수 있습니다</p>
//             <button onClick={() => console.log('로그인 페이지로 이동')}>
//               로그인
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <div>
//             {Array(5)
//               .fill()
//               .map((_, index) => (
//                 <Star
//                   key={index}
//                   onClick={() => handleStarClick(index)}
//                   style={{
//                     cursor: 'pointer',
//                     color: index < score ? 'gold' : 'lightgray',
//                   }}
//                 />
//               ))}
//           </div>
//         </>
//       )}

//       <Dialog open={modalIsOpen} onClose={handleCancel}>
//         <DialogTitle style={{ textAlign: 'center' }}>리뷰 작성</DialogTitle>
//         <DialogContent>
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'flex-end',
//               marginBottom: '10px',
//               width: '300px',
//             }}
//           >
//             {Array(5)
//               .fill()
//               .map((_, index) => (
//                 <Star
//                   key={index}
//                   onClick={() => setTempScore(index + 1)}
//                   style={{
//                     cursor: 'pointer',
//                     color: index < tempScore ? 'gold' : 'lightgray',
//                     fontSize: '20px',
//                     marginRight: '2px',
//                   }}
//                 />
//               ))}
//           </div>
//           <textarea
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//             placeholder="리뷰를 작성하세요."
//             rows="6"
//             style={{
//               width: '100%',
//               padding: '10px',
//               borderRadius: '5px',
//               border: '1px solid lightgray',
//               resize: 'none',
//               fontSize: '16px',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancel} color="secondary" variant="contained">
//             취소
//           </Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             제출
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default RecipeEvaluation;
