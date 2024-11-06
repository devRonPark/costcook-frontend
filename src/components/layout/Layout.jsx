import styled from 'styled-components';
import Header from './Header/Header';
import Main from './Main';
import Footer from './Footer';
import { useAuth } from '../../context/Auth/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid rgb(224, 224, 224);
`;

const Content = styled.div`
  height: calc(100vh - 138px);
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto; /* 세로 스크롤 추가 */
`;

const Layout = ({
  children,
  isBackBtnExist = false,
  isSearchBtnExist = false,
  pageName = '',
  onBackClick = () => window.history.back(),
  onFilterClick = () => {},
  onShareClick = () => {},
  onLikeClick = () => {},
  onDeleteClick = () => {},
  isRecipeListPage = false,
  isRecipeDetailPage = false,
  isFavoritePage = false,
  favorite = false,
  onToggleFavorite = () => {},
}) => {
  const { state } = useAuth();
  return (
    <Container>
      <Header
        state={state}
        isBackBtnExist={isBackBtnExist}
        isSearchBtnExist={isSearchBtnExist}
        pageName={pageName}
        onBackClick={onBackClick}
        onFilterClick={onFilterClick}
        onShareClick={onShareClick}
        onLikeClick={onLikeClick}
        onDeleteClick={onDeleteClick}
        isRecipeListPage={isRecipeListPage}
        isRecipeDetailPage={isRecipeDetailPage}
        isFavoritePage={isFavoritePage}
        favorite={favorite}
        onToggleFavorite={onToggleFavorite}
      />
      <Content>
        <Main>{children}</Main>
      </Content>
      <Footer state={state} />
    </Container>
  );
};

export default Layout;
