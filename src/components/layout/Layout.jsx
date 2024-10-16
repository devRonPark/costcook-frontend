import styled from 'styled-components';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const Layout = ({ children }) => (
  <Container>
    <Header />
    <Main>{children}</Main>
    <Footer />
  </Container>
);

export default Layout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid rgb(224, 224, 224);
`;
