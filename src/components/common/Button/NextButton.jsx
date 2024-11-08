import styled from 'styled-components';

// 버튼 스타일 정의
const Button = styled.button`
  width: 80%;
  background-color: ${(props) => (props.disabled ? 'lightgray' : '#FFDB58')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  border-radius: 25px;
  border: none; // 기본 테두리 제거
  padding: 10px; // 패딩 추가
  font-size: 16px; // 글자 크기 설정
  transition: background-color 0.3s; // 배경색 전환 효과
  font-family: 'GmarketSansMedium';

  &:hover {
    background-color: ${(props) =>
      !props.disabled && '#FFD700'}; // hover 시 진한 노란색
  }
`;

const NextButton = ({ onNext, isNextDisabled }) => {
  return (
    <Button onClick={onNext} disabled={isNextDisabled}>
      다음
    </Button>
  );
};

export default NextButton;
