import styled from 'styled-components';

const RoundedButton = ({
  text = '버튼',
  onClick = () => (window.location.href = '#'),
  backgroundColor = 'white',
  hoverBackgroundColor = '#e0a44b',
  width = '400px',
  border = '1px solid black',
  isDisabled = false,
  style = {}, // style props 추가
}) => {
  console.log(isDisabled);
  return (
    <RoundedButtonContainer
      onClick={isDisabled ? null : onClick}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      width={width}
      border={border}
      disabled={isDisabled}
      style={style} // style props 전달
    >
      {text}
    </RoundedButtonContainer>
  );
};

export default RoundedButton;

const RoundedButtonContainer = styled.button`
  width: ${(props) => props.width};
  height: 60px;
  font-size: 20px;
  background-color: ${(props) =>
    props.disabled ? 'lightgray' : props.backgroundColor};
  border: ${(props) => props.border};
  padding: 10px;
  border-radius: 20px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.disabled ? '#666' : 'black')};

  &:hover {
    background-color: ${(props) =>
      !props.disabled && props.hoverBackgroundColor}; // hover 시 색상 적용
  }
`;
