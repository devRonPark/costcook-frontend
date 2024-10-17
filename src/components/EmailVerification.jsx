import { useState } from 'react';
import styled from 'styled-components';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import AuthApi from '../services/auth.api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
  background-color: #f9f9f9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
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
  color: ${(props) => (props.error ? 'red' : 'green')};
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`;

const EmailVerification = ({ onSend }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // 이메일 전송 처리
    onSend(email); // 이메일 발송 함수 호출
    setMessage('인증 코드가 이메일로 발송되었습니다.'); // 상태 업데이트
    setIsLoading(false);
  };

  return (
    <Container>
      <h2>이메일 인증</h2>
      <Form onSubmit={handleSendVerification}>
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '전송 중...' : '인증 메일 발송'}
        </Button>
      </Form>
      {message && (
        <Message error={isError}>
          {isError ? <ErrorOutline /> : <CheckCircleOutline />}
          {message}
        </Message>
      )}
    </Container>
  );
};

export default EmailVerification;
