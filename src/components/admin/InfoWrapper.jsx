import styled from 'styled-components';

const InfoWrapper = styled.div`
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

export default InfoWrapper;
