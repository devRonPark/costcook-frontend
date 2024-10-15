import styled from 'styled-components';

const Main = ({ children }) => <MainContainer>{children}</MainContainer>;

export default Main;

const MainContainer = styled.main`
  flex: 10; /* 10 parts of the total height */
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;
