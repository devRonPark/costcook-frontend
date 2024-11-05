import styled from 'styled-components';
import { formatCreationDate, renderStars } from '../utils/format';
import { Box } from '@mui/material';
import { Star } from '@mui/icons-material';

// 카드 스타일링
const CardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  margin: 10px 0; /* 카드 간격 */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px; /* 이미지와 텍스트 간격 */
`;

const ContentContainer = styled.div`
  flex: 1; /* 남은 공간 차지 */
`;

const Nickname = styled.h4`
  margin: 0;
  font-size: 16px; /* 닉네임 크기 */
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px; /* UpdatedAt과의 간격 */
`;

const AverageRating = styled.span`
  margin-left: 4px; /* 평점 텍스트와 아이콘 간격 */
  font-size: 14px; /* 평점 텍스트 크기 */
`;

const UpdatedAt = styled.p`
  font-size: 12px;
  color: gray; /* 업데이트일 텍스트 색상 */
  margin: 0; /* 기본 여백 제거 */
  align-self: flex-start; /* 중앙 정렬을 위한 설정 */
`;

const ReviewMetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 전체 너비 사용 */
  margin-top: 4px; /* 닉네임과의 간격 */
`;

const Comment = styled.p`
  margin: 0; /* 기본 여백 제거 */
  font-size: 14px; /* 코멘트 크기 */
  color: #333; /* 코멘트 색상 */
`;

const RecipeReviewCard = ({ review }) => {
  return (
    <CardContainer>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ProfileImage
          src={`${import.meta.env.VITE_BASE_SERVER_URL}${
            review.user.profileUrl
          }`}
          alt={`${review.user.nickname}'s profile`}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Nickname>{review.user.nickname}</Nickname>
          <ReviewMetaContainer>
            <RatingContainer>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  style={{
                    color: index < review.score ? 'gold' : 'lightgray',
                    fontSize: '20px', // 아이콘 크기 조정
                  }}
                />
              ))}
              <AverageRating>({review.score})</AverageRating>
            </RatingContainer>
            <UpdatedAt>{formatCreationDate(review.updatedAt)}</UpdatedAt>
          </ReviewMetaContainer>
        </div>
      </div>
      <ContentContainer>
        <Comment>{review.comment}</Comment>
      </ContentContainer>
    </CardContainer>
  );
};

export default RecipeReviewCard;
