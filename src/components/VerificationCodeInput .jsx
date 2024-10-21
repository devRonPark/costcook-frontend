import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #4caf50;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
  }

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
  }
`;

const Message = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: red;
`;

const TimerMessage = styled.p`
  margin-top: 15px;
  font-size: 18px; /* 크기를 크게 설정 */
  font-weight: bold; /* 굵게 설정 */
  color: red; /* 빨간색 */
`;

const VerificationCodeInput = ({ onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 (300초)
  const [isExpired, setIsExpired] = useState(false);

  const handleVerification = (e) => {
    e.preventDefault();
    onVerify(verificationCode); // 인증 코드 확인 함수 호출
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
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

  return (
    <Form onSubmit={handleVerification}>
      <Title>인증 코드를 입력해주세요</Title>
      <Input
        type="text"
        placeholder="인증 코드"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
        disabled={isExpired} // 시간이 초과되면 입력 불가
      />
      <Button type="submit" disabled={isExpired}>
        인증 코드 확인
      </Button>
      {message && <Message>{message}</Message>}
      <TimerMessage>{formatTimeLeft(timeLeft)}</TimerMessage>
    </Form>
  );
};

export default VerificationCodeInput;
