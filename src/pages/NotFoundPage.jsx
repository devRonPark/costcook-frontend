// NotFound.js
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  text-align: center;
`;

const NotFoundPage = () => (
  <NotFoundContainer>
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>입력한 URL이 올바르지 않습니다.</p>
  </NotFoundContainer>
);

export default NotFoundPage;
