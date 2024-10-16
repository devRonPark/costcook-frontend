import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import startScreenImage from '../assets/images/start_screen_img.png';
import LoginPage from './LoginPage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px; // 최대 너비 600px
  min-height: 100vh; // 최소 높이 100vh
  margin: 0 auto; // 수평 중앙 정렬
  background-color: #f9f9f9; // 배경색
`;

const Logo = styled.img`
  width: 150px; // 로고 크기 조절
  height: auto;
  margin-bottom: 20px;
`;

const ServiceName = styled.h1`
  font-size: 2rem; // 서비스 이름 폰트 크기
  color: #333; // 글자 색상
  margin: 10px 0;
`;

const ServiceDescription = styled.p`
  font-size: 1.2rem; // 서비스 설명 폰트 크기
  color: #666; // 글자 색상
  text-align: center;
  padding: 0 20px; // 텍스트 패딩
`;

const PreLoginPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 후에 로딩 상태 변경
    const timer = setTimeout(() => {
      setLoading(false);
      // 여기에서 메인 페이지로 리디렉션 할 수 있습니다.
    }, 2000);

    return () => clearTimeout(timer); // 클린업 함수
  }, []);

  if (loading) {
    return (
      <Container>
        <Logo src={startScreenImage} alt="CostCook Logo" />
        {/* 로고 이미지 경로 */}
        <ServiceName>CostCook</ServiceName>
        <ServiceDescription>1주일 예산 맞춤 레시피 추천</ServiceDescription>
      </Container>
    );
  }

  // 로딩이 끝나면 리디렉션하거나 메인 페이지 내용을 반환할 수 있습니다.
  return <LoginPage />; // 여기에 실제 메인 페이지 컴포넌트를 추가하세요.
};

export default PreLoginPage;
