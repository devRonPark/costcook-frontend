import styled from 'styled-components';
import { formatCreationDate, renderStars } from '../utils/format';
import { Box } from '@mui/material';
import { Star } from '@mui/icons-material';
import DropdownButton from './dropdown/DropdownButton';
import DropdownMenu from './dropdown/DropdownMenu';
import { forwardRef, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

// 카드 스타일링
const CardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-family: 'yg-jalnan';
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px; /* UpdatedAt과의 간격 */
`;

const AverageRating = styled.span`
  margin-left: 4px; /* 평점 텍스트와 아이콘 간격 */
  margin-top: 6px;
  font-size: 14px; /* 평점 텍스트 크기 */
  font-family: 'GangwonEdu_OTFBoldA';
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
  font-family: 'GmarketSansMedium';
`;

// props 로 loginUserId 를 전달받아서, loginUserId 와 review.user.id 가 일치하면, 드롭다운 메뉴 영역이 화면에 보여진다.
const RecipeReviewCard = forwardRef(
  ({ review, onEdit, onDelete, loginUserId }, ref) => {
    const [dropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 메뉴 활성화 여부 제어
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
      setIsDeleteModalOpen(true); // 모달 오픈
    };

    const handleConfirmDelete = () => {
      onDelete(review); // 삭제 처리
      setIsDeleteModalOpen(false); // 모달 닫기
    };

    const handleCancelDelete = () => {
      setIsDeleteModalOpen(false); // 모달 닫기
    };

    const handleDropdown = () => {
      setDropdownOpen((prev) => !prev);
    };

    const handleEdit = () => {
      // 수정 화면으로 이동.
      onEdit(review); // 수정 핸들러
      setDropdownOpen(false); // 드롭다운 닫기
    };

    const menuItems = [
      {
        text: '수정',
        onClick: handleEdit,
      },
      {
        text: '삭제',
        onClick: handleDeleteClick,
      },
    ];

    return (
      <CardContainer ref={ref}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
          }}
        >
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
          {/* 드롭다운 메뉴 영역 */}
          {loginUserId === review.user.id && (
            <div style={{ position: 'absolute', right: 0 }}>
              <DropdownButton onClick={handleDropdown} />
              {dropdownOpen && (
                <DropdownMenu
                  items={menuItems}
                  isOpen={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          )}
        </div>
        <ContentContainer>
          <Comment>{review.comment}</Comment>
        </ContentContainer>

        {/* 삭제 확인 모달 */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message={`${review.recipe.title} 리뷰를 삭제하시겠습니까?`}
        />
      </CardContainer>
    );
  }
);

export default RecipeReviewCard;
