import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RefreshPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fromPage = location.state?.fromPage;

    // 잘못된 접근일 경우 메인 페이지로 리다이렉트
    if (!fromPage) {
      navigate('/');
      return;
    }

    // 0.3초 후 원래 페이지로 리다이렉트
    setTimeout(() => {
      navigate(fromPage);
    }, 300);
  }, [navigate, location]);

  return (
    <Container>
      <Message>잠시 기다려 주세요, 페이지를 다시 로드하고 있습니다...</Message>
    </Container>
  );
};

// 스타일링 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #333;
`;

export default RefreshPage;