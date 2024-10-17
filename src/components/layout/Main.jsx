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
  justify-content: center;
  background-color: #fff;
`;

const SubContainer = styled.div`
  flex: 1;
  display: flex;
  width: 85%;
  margin-top: 20px;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
  border: 1px solid black;
`;

const LeftText = styled.h2`
  text-align: left;
`;
