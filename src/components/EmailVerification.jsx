import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

const EmailVerification = ({ onSend }) => {
  const [email, setEmail] = useState(''); // 입력된 이메일 상태 저장
  const [message, setMessage] = useState(''); // 사용자에게 보여줄 메시지 상태 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isError, setIsError] = useState(false); // 에러 발생 여부 저장
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 형식 유효성 저장

  // 이메일 형식 검증 함수
  const validateEmail = (inputVal) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규식
    return emailRegex.test(inputVal); // 이메일 형식에 맞는지 여부 반환
  };

  // 이메일 입력 시 상태 업데이트 및 유효성 검사
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsEmailValid(validateEmail(inputEmail)); // 이메일 유효성 검사 결과 업데이트
  };

  // 이메일 인증 전송 처리 함수
  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!isEmailValid) return; // 이메일 형식이 유효하지 않으면 함수 종료
    setIsLoading(true); // 로딩 상태 시작
    setMessage(''); // 이전 메시지 초기화

    try {
      await onSend(email); // 이메일 발송 함수 호출
      setMessage('인증 코드가 이메일로 발송되었습니다.'); // 성공 메시지 설정
      setIsError(false); // 에러 상태 초기화
    } catch (error) {
      setMessage('이메일 전송에 실패했습니다. 다시 시도해주세요.'); // 실패 메시지 설정
      setIsError(true); // 에러 상태 설정
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <Form onSubmit={handleSendVerification}>
      <InfoText>
        계정 보안을 위해 이메일 인증이 필요합니다. 인증번호가 입력하신 이메일로
        발송됩니다. 인증번호가 도착하지 않으면 스팸함을 확인해주세요.
      </InfoText>
      <InputWrapper>
        <Input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={handleEmailChange}
          isInvalid={!isEmailValid && email !== ''}
          required
        />
        {!isEmailValid && email !== '' && (
          <ErrorMessage>유효한 이메일 주소를 입력하세요.</ErrorMessage>
        )}
      </InputWrapper>
      <Button type="submit" disabled={isLoading || !isEmailValid}>
        {isLoading ? '전송 중...' : '이메일 인증'}
      </Button>
      {message && (
        <Message error={isError}>
          {isError ? <ErrorOutline /> : <CheckCircleOutline />}
          {message}
        </Message>
      )}
    </Form>
  );
};

export default EmailVerification;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 16px;
`;

const InfoText = styled.p`
  font-size: 18px;
  color: #333;
  line-height: 1.5;
  text-align: center;
  margin-top: 40px;
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: none;
  outline: none;
  border-bottom: 1px solid
    ${({ isInvalid }) => (isInvalid ? '#ff4d4f' : '#ccc')};
  margin-top: 100px;
  &:focus {
    border-color: ${({ isInvalid }) => (isInvalid ? '#ff4d4f' : '#007bff')};
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  position: absolute;
  bottom: -20px;
  left: 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#007bff')};
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;
  margin-top: 60px;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: ${({ error }) => (error ? '#ff4d4f' : '#28a745')};
  font-size: 14px;
  svg {
    margin-right: 8px;
  }
`;
