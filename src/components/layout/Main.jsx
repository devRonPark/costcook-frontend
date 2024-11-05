import styled from 'styled-components';

const Main = ({ children }) => (
  <MainContainer>
    <SubContainer>{children}</SubContainer>
  </MainContainer>
);

export default Main;

const MainContainer = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  justify-content: flex-start; /* 조정: 중앙 정렬이 아닌 시작점 정렬 */
  background-color: #fff;
  overflow-y: scroll; /* 세로 스크롤을 추가 */
  position: relative;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* 웹킷 기반 브라우저에서 스크롤바 숨김 */
  }
`;

const SubContainer = styled.div`
  flex: 1;
  display: flex;
  width: 85%;
  margin: 20px;
  flex-direction: column;
  align-items: center;
`;
