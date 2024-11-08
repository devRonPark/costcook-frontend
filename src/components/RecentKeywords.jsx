import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import DropdownButton from './dropdown/DropdownButton';
import DropdownMenu from './dropdown/DropdownMenu';
import { useNavigate } from 'react-router-dom';

const RecentKeywordsContainer = styled.div`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
`;

const KeywordList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const KeywordItem = styled.li`
  display: flex;
  align-items: center;
  background-color: #ffebcc;
  color: #ff8c00;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px 0;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden; // 부모 요소에 숨김 처리 적용
  position: relative;
`;

const ClearButton = styled(ClearIcon)`
  font-size: 14px !important;
  font-weight: bold !important;
  margin-left: 4px;
  cursor: pointer;
`;

const NoKeywordsMessage = styled.p`
  color: #888;
  font-size: 14px;
`;

// 삭제 완료 버튼 스타일
const CompleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: black;
  font-size: 14px;

  &:hover {
    color: #ff8c00;
  }
`;

const RecentKeywords = ({
  recentKeywords,
  onRemoveKeyword,
  onRemoveAllKeywords,
  onKeywordClick,
}) => {
  const navigate = useNavigate();
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false); // 선택 삭제 모드 상태

  const handleDropdownMenu = () => {
    setDropdownMenuOpen((prev) => !prev);
  };

  const handleSelectDelete = () => {
    setIsSelecting(true);
    setDropdownMenuOpen(false);
  };

  const handleDeleteCompletion = () => {
    setIsSelecting(false);
  };

  const handleKeywordItemClick = (keyword) => {
    // 선택 삭제 모드
    if (isSelecting) {
      onRemoveKeyword(keyword);
      return;
    }

    onKeywordClick(keyword);
    // 선택 삭제 모드가 아닌 상태
    navigate(`/recipes/search?keyword=${keyword}`);
  };

  // useMemo로 menuItems 메모이제이션
  const menuItems = useMemo(
    () => [
      {
        text: '선택 삭제',
        onClick: handleSelectDelete,
      },
      {
        text: '전체 삭제',
        onClick: () => onRemoveAllKeywords,
      },
    ],
    [handleSelectDelete, onRemoveAllKeywords]
  );

  // useMemo로 recentKeywords 메모이제이션
  const keywordList = useMemo(
    () =>
      recentKeywords.map((keyword, index) => (
        <KeywordItem
          key={index}
          onClick={() => handleKeywordItemClick(keyword)}
        >
          {keyword}
          {isSelecting && <ClearButton className="clear-button" />}
        </KeywordItem>
      )),
    [recentKeywords, isSelecting]
  );

  return (
    <RecentKeywordsContainer>
      <Header>
        <h4>최근 검색어</h4>
        {/* 드롭다운 */}
        {recentKeywords.length > 0 && !isSelecting && (
          <div style={{ position: 'relative' }}>
            <DropdownButton onClick={handleDropdownMenu} />
            <DropdownMenu
              items={menuItems}
              isOpen={dropdownMenuOpen}
              onClose={() => setDropdownMenuOpen(false)}
            />
          </div>
        )}
        {isSelecting && (
          <CompleteButton onClick={handleDeleteCompletion}>
            삭제 완료
          </CompleteButton>
        )}
      </Header>
      {recentKeywords.length === 0 ? (
        <NoKeywordsMessage>최근 검색어가 없어요</NoKeywordsMessage>
      ) : (
        <KeywordList>{keywordList}</KeywordList>
      )}
    </RecentKeywordsContainer>
  );
};

export default RecentKeywords;
