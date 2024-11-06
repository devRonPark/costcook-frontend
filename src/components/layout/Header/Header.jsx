import React from 'react';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home'; // MUI Home 아이콘
import SearchIcon from '@mui/icons-material/Search'; // MUI Search 아이콘
import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트
import BackButton from '../../common/Button/BackButton'; // 뒤로가기 버튼
import FilterButton from '../../common/Button/FilterButton'; // 필터 버튼
import ShareButton from '../../common/Button/ShareButton'; // 공유 버튼
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteButton from '../../common/Button/DeleteButton';

const Header = ({
  state,
  isSearchBtnExist,
  pageName, // 현재 페이지 이름
  isBackBtnExist, // 뒤로가기 버튼 존재 여부
  onBackClick, // 뒤로 가기 버튼 클릭 이벤트 핸들러
  onFilterClick, // 필터 버튼 클릭 이벤트 핸들러
  onShareClick, // 공유 버튼 클릭 이벤트 핸들러
  onDeleteClick, // 삭제 버튼 클릭 이벤트 핸들러
  isRecipeListPage, // 레시피 목록 페이지 여부
  isRecipeDetailPage, // 레시피 상세 페이지 여부
  isFavoritePage, // 저장한 레시피 페이지 여부
  favorite, // 현재 즐겨찾기 상태
  onToggleFavorite, // 즐겨찾기 상태 제어 함수
}) => (
  <HeaderContainer>
    <IconWrapper>
      {isBackBtnExist ? (
        <BackButton onClick={onBackClick} /> // 이전 페이지로 이동
      ) : (
        <Link to="/">
          {' '}
          {/* 홈 아이콘 클릭 시 홈으로 이동 */}
          <HomeIconStyled />
        </Link>
      )}
    </IconWrapper>
    {pageName && (
      <PageName isRecipeDetailPage={isRecipeDetailPage}>{pageName}</PageName> // 레시피 상세 페이지는 레시피 이름 폰트
    )}{' '}
    {/* 페이지 이름 표시 */}
    <IconWrapper>
      {isRecipeListPage && <FilterButton onClick={onFilterClick} />}{' '}
      {/* 필터 버튼 */}
      {isRecipeDetailPage && ( // 레시피 상세 페이지일 때
        <>
          <ShareButton handleShareOpen={onShareClick} /> {/* 공유 버튼 */}
          <FavoriteButton onClick={onToggleFavorite}>
            {favorite ? (
              <FavoriteIcon style={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon style={{ color: 'black' }} />
            )}
          </FavoriteButton>
        </>
      )}
      {isSearchBtnExist && (
        <Link to="/search">
          {' '}
          {/* 검색 아이콘 클릭 시 검색 페이지로 이동 */}
          <SearchIconStyled />
        </Link>
      )}
      {isFavoritePage && <DeleteButton onClick={onDeleteClick} />}
    </IconWrapper>
  </HeaderContainer>
);

export default Header;

const HeaderContainer = styled.header`
  box-sizing: border-box; // 박스 모델 설정
  height: 65px; // 헤더 높이
  width: 100%; // 전체 너비
  padding: 0 16px; // 좌우 패딩
  display: flex; // 플렉스 박스 설정
  align-items: center; // 수직 중앙 정렬
  justify-content: space-between; /* 아이콘과 제목 사이에 공간 분배 */
  background-color: #f8f9fa; // 배경색
`;

const IconWrapper = styled.div`
  cursor: pointer; // 커서 포인터로 설정
  font-size: 32px; /* 아이콘 크기 조정 */
  color: #333; /* 아이콘 색상 */
  display: flex; // 플렉스 박스 설정
  align-items: center; /* 아이콘 정렬 */
  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const HomeIconStyled = styled(HomeIcon)`
  font-size: 32px !important; // 아이콘 크기 조정
`;

const SearchIconStyled = styled(SearchIcon)`
  font-size: 32px !important; // 아이콘 크기 조정
`;

// 헤더title
const PageName = styled.h1`
  font-family: ${(props) =>
    props.isRecipeDetailPage ? 'Mungyeong-Gamhong-Apple' : 'STUNNING-Bd'};
  font-weight: ${(props) => (props.isRecipeDetailPage ? 100 : 'normal')};
  flex: 1; /* 제목이 공간을 차지하게 함 */
  text-align: center; /* 가운데 정렬 */
  font-size: 1.5rem; /* 제목 크기 조정 */
  color: #333; /* 제목 색상 */
`;

const FavoriteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  font-size: 32px;
  cursor: pointer;
  z-index: 1;
`;
