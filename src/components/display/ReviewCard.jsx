import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { formatCreationDate, renderStars } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import DropdownButton from '../dropdown/DropdownButton';
import DropdownMenu from '../dropdown/DropdownMenu';
import ConfirmationModal from '../ConfirmationModal';

const ReviewCard = forwardRef(({ review, onEdit, onDelete }, ref) => {
  const navigate = useNavigate();
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
      <ThumbnailImageBox>
        <Image
          src={`${import.meta.env.VITE_BASE_SERVER_URL}${
            review.recipe.thumbnailUrl
          }`}
          alt={review.recipe.title ?? ''}
        />
      </ThumbnailImageBox>
      <ContentContainer>
        <Header>
          <TitleText onClick={() => navigate(`/recipes/${review.recipe.id}`)}>
            {review.recipe.title}
          </TitleText>
          {/* 드롭다운 메뉴 영역 */}
          <div style={{ position: 'relative' }}>
            <DropdownButton onClick={handleDropdown} />
            {dropdownOpen && (
              <DropdownMenu
                items={menuItems}
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
              />
            )}
          </div>
        </Header>
        <ReviewContent>{review.comment}</ReviewContent>
        <Footer>
          <StarText>
            {renderStars(review.score)} {review.score}
          </StarText>
          <DateText>{formatCreationDate(review.updatedAt)}</DateText>
        </Footer>
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
});

export default ReviewCard;

// 카드 컨테이너
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  width: 100%;
`;

// 썸네일 이미지 영역
const ThumbnailImageBox = styled.div`
  height: 100px; // 높이 조정
  width: 100px; // 너비 조정
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
`;

// 썸네일 이미지
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 내용 컨테이너
const ContentContainer = styled.div`
  flex: 1;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
`;

// 헤더
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 레시피 이름
const TitleText = styled.h3`
  font-size: 16px;
  margin: 0;
  flex: 1;
`;

// 리뷰 내용
const ReviewContent = styled.p`
  font-size: 14px;
  margin: 5px 0;
`;

// 푸터
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; // 내용을 아래로 밀어줌
`;

// 평점
const StarText = styled.p`
  font-size: 12px;
  margin: 0;
`;

// 리뷰 생성일
const DateText = styled.p`
  font-size: 12px;
  color: #757575; // 색상 조정
  margin: 0;
`;
