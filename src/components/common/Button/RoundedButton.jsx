import styled from 'styled-components';

const RoundedButton = ({
  text = '버튼', // 기본값: "버튼"
  onClick = () => (window.location.href = '#'), // 기본값: 페이지 이동 없음
  backgroundColor = 'white', // 기본값: 흰색 배경
  hoverBackgroundColor = '#e0a44b', // 기본값: hover 시 배경색
  width = '400px', // 기본값: 400px
  border = '1px solid black', // 기본값: 1px 실선 검정색
}) => {
  return (
    <RoundedButtonContainer
      onClick={onClick}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      width={width}
      border={border}
    >
      {text}
    </RoundedButtonContainer>
  );
};

export default RoundedButton;

const RoundedButtonContainer = styled.button`
  width: ${(props) => props.width}; // 가로 길이 설정
  height: 60px;
  font-size: 20px;
  background-color: ${(props) => props.backgroundColor}; // 배경색 설정
  border: ${(props) => props.border}; // 테두리 설정
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.hoverBackgroundColor}; // hover 시 배경색 설정
  }
`;
