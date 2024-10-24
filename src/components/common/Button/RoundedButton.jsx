import styled from 'styled-components';

const RoundedButton = ({
  text = '버튼', // 기본값: "버튼"
  onClick = () => (window.location.href = '#'), // 기본값: 페이지 이동 없음
  backgroundColor = 'white', // 기본값: 흰색 배경
  hoverBackgroundColor = '#e0a44b', // 기본값: hover 시 배경색
}) => {
  return (
    <MainContainer
      onClick={onClick}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
    >
      {text}
    </MainContainer>
  );
};

export default RoundedButton;

const MainContainer = styled.button`
  width: 400px;
  height: 60px;
  font-size: 20px;
  background-color: ${(props) => props.backgroundColor}; // 배경색 설정
  border: 1px solid black;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.hoverBackgroundColor}; // hover 시 배경색 설정
  }
`;
