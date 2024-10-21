import styled from 'styled-components';

const InfoContainer = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  z-index: 1000;

  box-sizing: border-box;
  padding: 20px;
  border: 1px solid rgb(224, 224, 224);
  border-top: none;
  
  background-color: #ffc107;
  color: white;
  text-align: center;
  font-weight: bold;

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

export default InfoContainer;