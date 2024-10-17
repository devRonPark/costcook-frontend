import styled from 'styled-components';

// SelectedInfoContainer 스타일 컴포넌트 정의
export const SelectedInfoContainer = styled.div`
  position: fixed; 
  top: 64px; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 100%;
  max-width: 600px;
  padding: 20px; 
  background-color: #ffc107; 
  color: white; 
  text-align: center; 
  font-weight: bold;
  z-index: 1000; 
  box-sizing: border-box;
  border: 1px solid rgb(224, 224, 224);
  border-top: none;
`;

// MarqueeText 스타일 컴포넌트 정의
export const MarqueeText = styled.div`
  display: inline-block;
  white-space: nowrap; 
  ${({ shouldAnimate }) =>
    shouldAnimate
      ? `animation: marquee 15s linear infinite;`
      : 'transform: translateX(0); text-align: center;'}
  
  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

// ContentContainer 스타일 컴포넌트 정의
export const ContentContainer = styled.div`
  padding: 16px;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  margin-top: 140px; 
`;