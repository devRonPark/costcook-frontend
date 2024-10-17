import styled from 'styled-components';

const MovingText = styled.div`
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

export default MovingText;