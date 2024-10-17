import { useState } from 'react';
import styled from 'styled-components';

// Styled Components
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

const VerificationCodeInput = ({ onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerification = (e) => {
    e.preventDefault();
    onVerify(verificationCode); // 인증 코드 확인 함수 호출
  };

  return (
    <Container>
      <Form onSubmit={handleVerification}>
        <Title>인증 코드를 입력해주세요</Title>
        <Input
          type="text"
          placeholder="인증 코드"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <Button type="submit">인증 코드 확인</Button>
      </Form>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default VerificationCodeInput;
