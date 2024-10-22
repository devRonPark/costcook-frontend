import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid'; // UUID 패키지에서 v4 함수를 가져옵니다.
import { useAuth } from '../context/Auth/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: white;
  margin: auto; /* 중앙 정렬 */
`;

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px; /* 폰트 크기 */
  text-align: center;
  margin-bottom: 30px; /* 설명과 입력 필드 간의 간격 */
  color: #555; /* 부드러운 색상 */
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 30px; /* 입력 필드와 버튼 간의 간격 */
`;

const Input = styled.input`
  width: 40px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  outline: none;
  border: none; // 기본 border 제거
  border-bottom: 2px solid #ccc; // border-bottom만 존재하게 설정

  &:focus {
    border-color: #007bff;
  }

  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
  }
`;

const Button = styled.button`
  margin-top: 30px;
  padding: 12px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#4caf50')};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
  }
`;

const Message = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: red;
  text-align: center; /* 메시지 중앙 정렬 */
`;

const TimerMessage = styled.p`
  margin-top: 15px;
  font-size: 20px; /* 크기를 크게 설정 */
  font-weight: bold; /* 굵게 설정 */
  color: red; /* 빨간색 */
  text-align: center;
`;

const RequestNewCode = styled.p`
  width: fit-content;
  font-size: 14px;
  color: #007bff; /* 기본 텍스트 색상 */
  cursor: pointer;
  text-align: left; /* 왼쪽 정렬 */
  margin-top: 120px;
  border-bottom: 1px solid #007bff; /* 아래쪽 테두리 추가 */
  transition:
    color 0.3s ease,
    border-color 0.3s ease;
  display: inline-block; /* 콘텐츠에 맞게 너비 조정 */

  &:hover {
    color: #0056b3; /* 호버 시 텍스트 색상 변경 */
    border-color: #0056b3; /* 호버 시 테두리 색상 변경 */
  }

  &:focus {
    outline: none; /* 포커스 시 아웃라인 제거 */
    border-color: #0056b3; /* 포커스 시 테두리 색상 변경 */
  }
`;

const VerificationCodeInput = ({ onVerify, onResend }) => {
  const { state } = useAuth(); // state 가져오기
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 (300초)
  const [isExpired, setIsExpired] = useState(false);
  const [code, setCode] = useState(Array(6).fill('')); // 6자리 코드 상태
  const inputRefs = useRef([]);

  // 고유한 ID 생성
  const inputIds = useRef(Array.from({ length: 6 }, () => uuidv4()));

  const handleVerification = (e) => {
    e.preventDefault();
    const verificationCode = code.join(''); // 배열을 문자열로 변환
    onVerify(verificationCode); // 인증 코드 확인 함수 호출
  };

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (/^[0-9]$/.test(value)) {
      // 숫자 입력만 허용
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // 다음 필드로 자동 포커스 이동
      setTimeout(() => {
        if (index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      // 백스페이스 시 현재 필드 비어있으면 이전 필드로 포커스 이동
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      } else if (code[index]) {
        // 현재 인풋에 값이 있을 때 백스페이스를 누르면 값 제거
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    // 붙여넣기된 데이터 가져오기
    const pastedData = e.clipboardData.getData('text/plain');

    // 6자리 숫자만 추출
    const digits = pastedData.match(/[0-9]/g)?.slice(0, 6) || [];

    const newCode = [...code];

    // 붙여넣기된 숫자를 배열에 할당
    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    // 마지막 자리 입력 후 포커스 이동
    if (digits.length > 0) {
      inputRefs.current[Math.min(digits.length, 5)].focus();
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // 타이머 정리
    }
    setIsExpired(true);
    setMessage('시간 초과입니다. 인증 코드를 다시 요청하세요.');
    return null;
  }, [timeLeft]);

  // 남은 시간을 `MM:SS` 형식으로 변환
  const formatTimeLeft = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // 모든 자리의 입력이 완료되었는지 확인
  const isAllCodeEntered = code.every((digit) => digit !== '');

  const handleRequestNewCode = (email) => {
    // 새 인증번호 발급 요청 API 호출
    onResend(email);
    // API 호출 후 5분 스톱워치 초기화
    setTimeLeft(300); // 스톱워치 초기화
    setIsExpired(false); // 시간 초과 상태 초기화
    setCode(Array(6).fill('')); // 입력 필드 초기화
    inputRefs.current[0].focus(); // 첫 번째 인풋으로 포커스 이동
  };

  return (
    <Form onSubmit={handleVerification}>
      <Title>인증 코드를 입력해주세요</Title>
      <Description>전송된 인증 코드를 아래 입력란에 입력해주세요.</Description>
      <InputWrapper>
        {code.map((digit, index) => (
          <Input
            key={inputIds.current[index]} // 고유 ID를 key로 사용
            id={inputIds.current[index]} // 각 입력 필드에 고유한 ID 부여
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste} // 붙여넣기 이벤트 핸들러 추가
            ref={(el) => (inputRefs.current[index] = el)}
            required
            disabled={isExpired} // 시간이 초과되면 입력 불가
          />
        ))}
      </InputWrapper>
      <Button type="submit" disabled={isExpired || !isAllCodeEntered}>
        인증 코드 확인
      </Button>
      {message && <Message>{message}</Message>}
      <TimerMessage>{formatTimeLeft(timeLeft)}</TimerMessage>

      <RequestNewCode
        onClick={() => handleRequestNewCode(state.user.data.email)}
      >
        새 인증번호 요청
      </RequestNewCode>
    </Form>
  );
};

export default VerificationCodeInput;
