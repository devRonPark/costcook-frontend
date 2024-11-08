import styled from 'styled-components';
import { Star, StarOutline } from '@mui/icons-material';

const EvaluationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  width: 300px; /* 모바일 기준의 적당한 너비 */
`;

const ReviewMessage = styled.p`
  color: gray;
  font-size: 18px;
  text-align: center;
  margin: 10px 0; /* 메시지 주변 여백 */
  font-family: 'GangwonEdu_OTFBoldA';
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const StarIcon = styled.span`
  cursor: pointer;
  margin-right: 2px;
`;

const EvaluationPrompt = styled.p`
  text-align: center;
  margin-top: 5px;
  font-size: 18px; /* 평가 요청 메시지 크기 */
  font-family: 'GangwonEdu_OTFBoldA';
`;

const RecipeEvaluation = ({
  isMyReviewExist,
  reviewState,
  handleStarClick,
}) => (
  <EvaluationContainer>
    {isMyReviewExist ? (
      <ReviewMessage>리뷰를 이미 작성하셨습니다.</ReviewMessage>
    ) : (
      <>
        <StarContainer>
          {Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < reviewState.score; // 별점이 채워졌는지 확인
            return (
              <StarIcon key={index} onClick={() => handleStarClick(index)}>
                {isFilled ? (
                  <Star style={{ color: 'gold', fontSize: '24px' }} />
                ) : (
                  <StarOutline style={{ color: 'gold', fontSize: '24px' }} />
                )}
              </StarIcon>
            );
          })}
        </StarContainer>
        <EvaluationPrompt>레시피를 평가해주세요.</EvaluationPrompt>
      </>
    )}
  </EvaluationContainer>
);

export default RecipeEvaluation;
