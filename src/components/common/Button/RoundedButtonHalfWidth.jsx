import styled from 'styled-components';

const RoundedFilledButton = ({
  text = '버튼', // 기본값: "버튼"
  onClick = () => (window.location.href = '#'), // 기본값: 페이지 이동 없음
  backgroundColor = 'white', // 기본값: 흰색 배경
}) => {
  return (
    <MainContainer onClick={onClick} backgroundColor={backgroundColor}>
      {text}
    </MainContainer>
  );
};

export default RoundedFilledButton;

const MainContainer = styled.button`
  width: 200px;
  height: 40px;
  font-size: 20px;
  background-color: ${(props) => props.backgroundColor}; // 배경색 설정
  border: 1px solid black;
  padding: auto;
  border-radius: 20px;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
